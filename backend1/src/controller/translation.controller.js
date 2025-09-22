import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the correct directory path with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to delay execution for retry logic
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const translateContent = async (req, res) => {
    const { lang } = req.params; // The target language (e.g., 'en', 'hi', 'ta')
    const AZURE_KEY = process.env.AZURE_TRANSLATOR_KEY;
    const AZURE_REGION = process.env.AZURE_TRANSLATOR_REGION;
    const AZURE_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/';
    const MAX_RETRIES = 3; // Maximum number of retries for rate limiting
    const RETRY_DELAY = 1500; // Delay between retries in milliseconds

    try {
        // 1. Construct path for the base English translation file
        const baseFilePath = path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'locales', 'en', 'translation.json');

        // 2. Read the English content
        let englishJson = {};
        try {
            const baseTranslation = await fs.readFile(baseFilePath, 'utf8');
            englishJson = JSON.parse(baseTranslation);
        } catch (error) {
            console.error('Error reading translation.json:', error.message);
            return res.status(500).json({ message: 'Failed to load English content.' });
        }

        // 3. If the requested language is English or API credentials are missing, serve English content
        if (lang === 'en' || !AZURE_KEY || !AZURE_REGION) {
            if (!AZURE_KEY || !AZURE_REGION) {
                console.warn('API credentials missing, falling back to English content.');
            }
            return res.status(200).json(englishJson);
        }

        // 4. Prepare data for Azure API
        const keys = Object.keys(englishJson);
        const values = Object.values(englishJson);
        const textToTranslate = values.map(value => ({ Text: value }));

        // 5. Call Azure Translator with retry logic
        let attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                const response = await axios({
                    baseURL: AZURE_ENDPOINT,
                    url: '/translate',
                    method: 'post',
                    headers: {
                        'Ocp-Apim-Subscription-Key': AZURE_KEY,
                        'Ocp-Apim-Subscription-Region': AZURE_REGION,
                        'Content-type': 'application/json',
                    },
                    params: {
                        'api-version': '3.0',
                        'from': 'en',
                        'to': lang,
                    },
                    data: textToTranslate,
                    responseType: 'json'
                });

                // 6. Rebuild the JSON with translated text
                const translatedJson = {};
                const translations = response.data;
                translations.forEach((translation, index) => {
                    const originalKey = keys[index];
                    translatedJson[originalKey] = translation.translations[0].text;
                });

                // 7. Send the result to the frontend (no file saving for non-English languages)
                return res.status(200).json(translatedJson);

            } catch (error) {
                if (error.response && error.response.status === 429 && attempt < MAX_RETRIES - 1) {
                    console.warn(`Rate limit hit, retrying after ${RETRY_DELAY}ms... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
                    await delay(RETRY_DELAY * (attempt + 1)); // Linear delay, consider exponential backoff
                    attempt++;
                    continue;
                }
                console.error('Azure Translation Error:', error.response ? error.response.data : error.message);
                // Fall back to English content on any API error
                console.warn('API error occurred, falling back to English content.');
                return res.status(200).json(englishJson);
            }
        }

        // If max retries exceeded, fall back to English content
        console.warn('Max retries exceeded due to rate limiting, falling back to English content.');
        return res.status(200).json(englishJson);

    } catch (error) {
        console.error('Server Error:', error.message);
        return res.status(500).json({ message: 'Server error occurred.' });
    }
};