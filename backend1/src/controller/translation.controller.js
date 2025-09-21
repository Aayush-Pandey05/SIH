import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the correct directory path with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const translateContent = async (req, res) => {
    const { lang } = req.params; // The target language (e.g., 'hi', 'ta')

    const AZURE_KEY = process.env.AZURE_TRANSLATOR_KEY;
    const AZURE_REGION = process.env.AZURE_TRANSLATOR_REGION;
    const AZURE_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/';

    if (!AZURE_KEY || !AZURE_REGION) {
        return res.status(500).json({ message: "Translator API credentials are not configured on the server." });
    }

    try {
        // 1. Construct the path to your frontend's base translation file
        // It goes up from src/controller -> src -> backend1 -> SIH and then down into frontend
        const filePath = path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'locales', 'en', 'translation.json');

        // 2. Read the English content
        const baseTranslation = await fs.readFile(filePath, 'utf8');
        const englishJson = JSON.parse(baseTranslation);

        // 3. Prepare data for Azure API
        const keys = Object.keys(englishJson);
        const values = Object.values(englishJson);
        const textToTranslate = values.map(value => ({ Text: value }));

        // 4. Call Azure Translator
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

        // 5. Rebuild the JSON with translated text
        const translatedJson = {};
        const translations = response.data;
        translations.forEach((translation, index) => {
            const originalKey = keys[index];
            translatedJson[originalKey] = translation.translations[0].text;
        });

        // 6. Send the result to the frontend
        res.status(200).json(translatedJson);

    } catch (error) {
        console.error("Azure Translation Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to translate content." });
    }
};