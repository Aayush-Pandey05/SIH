import axios from "axios";
import Data from "../models/data.model.js"; // Import your Data model

export const processRequest = async (req, res) => {
  const { latitude, longitude, area, district } = req.body;

  // Get user ID from the authenticated request
  const userId = req.user.id; // This should come from your auth middleware

  if (!latitude || !longitude || !area) {
    return res.status(400).json({
      message:
        "Incomplete data provided. Please provide latitude, longitude, and area.",
    });
  }

  try {
    const agentInputString = `Please generate a feasibility report for a rooftop located at latitude ${latitude}, longitude ${longitude}, with an area of ${area} square meters and district ${district}.`;

    const payload = {
      input: agentInputString,
    };

    const fastApiUrl = "http://localhost:5000/get-recommendation";

    console.log(
      "Forwarding request to FastAPI with constructed payload:",
      payload
    );

    const response = await axios.post(fastApiUrl, payload);

    // Extract the AI recommendation from the response
    const aiRecommendation =
      response.data.ai_recommendation || JSON.stringify(response.data);

    // Save data to MongoDB
    const newDataEntry = new Data({
      userId: userId,
      ai_recommendation: aiRecommendation,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      area: parseFloat(area),
      district: district || "Unknown",
    });

    const savedData = await newDataEntry.save();
    console.log("Data saved successfully:", savedData._id);

    // Return the response along with the saved data info
    return res.status(200).json({
      ...response.data,
      dataId: savedData._id,
      message: "Data processed and saved successfully",
    });
  } catch (error) {
    console.error(
      "Error in process controller:",
      error.response ? error.response.data : error.message
    );

    // If it's a database error, provide more specific error message
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error while saving data.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error while processing request.",
    });
  }
};
