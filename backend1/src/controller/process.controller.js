import axios from 'axios';

export const processRequest = async (req, res) => {

    const { latitude, longitude, area } = req.body;

    if (!latitude || !longitude || !area) {
        return res.status(400).json({ message: "Incomplete data provided. Please provide latitude, longitude, and area." });
    }

    try {

        const agentInputString = `Please generate a feasibility report for a rooftop located at latitude ${latitude}, longitude ${longitude}, with an area of ${area} square meters.`;

        const payload = {
            input: agentInputString
        };
        
        const fastApiUrl = 'http://localhost:5000/get-recommendation';
        
        console.log("Forwarding request to FastAPI with constructed payload:", payload);

        const response = await axios.post(fastApiUrl, payload);

        return res.status(200).json(response.data);

    } catch (error) {
        console.error("Error in process controller:", error.response ? error.response.data : error.message);
        return res.status(500).json({ message: "Internal server error while communicating with AI service." });
    }
};

