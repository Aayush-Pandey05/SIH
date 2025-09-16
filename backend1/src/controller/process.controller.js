import axios from "axios";
import Data from "../models/data.model.js";

export const processRequest = async (req, res) => {
  const { latitude, longitude, area, district } = req.body;
  const userId = req.user.id;

  if (!latitude || !longitude || !area) {
    return res.status(400).json({
      message: "Incomplete data provided. Please provide latitude, longitude, and area.",
    });
  }

  try {
    // Check if user has existing data and handle accordingly
    const existingData = await Data.findOne({ userId: userId }).sort({ createdAt: -1 });
    
    if (existingData) {
      console.log("Found existing data for user:", userId);
      
      // Option A: Return existing data instead of processing again
      /*
      return res.status(200).json({
        ai_recommendation: existingData.ai_recommendation,
        annual_savings_inr: existingData.annual_savings_inr || 0,
        payback_period_years: existingData.payback_period_years || 0,
        gwl: existingData.gwl,
        gwl_unit: existingData.gwl ? "mbgl" : null,
        gwl_available: existingData.gwl !== null,
        dataId: existingData._id,
        message: "Returning existing data for this user",
        isExisting: true
      });
      */
      
      // Option B: Update existing record instead of creating new one
      console.log("Will update existing record instead of creating new one");
    }

    // Create the payload for the enhanced endpoint
    const agentInputString = `Please generate a feasibility report for a rooftop located at latitude ${latitude}, longitude ${longitude}, with an area of ${area} square meters and district ${district}.`;

    const payload = {
      input: agentInputString,
      district: district || "Unknown",
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      area: parseFloat(area)
    };

    // Call the enhanced FastAPI endpoint
    const fastApiUrl = "http://localhost:5000/get-recommendation-with-gwl";
    console.log("Forwarding request to enhanced FastAPI with payload:", payload);

    const response = await axios.post(fastApiUrl, payload);

    // Extract and properly format AI recommendation
    let aiRecommendationString = "";
    let annualSavings = 0;
    let paybackPeriod = 0;
    
    const aiRecommendation = response.data.ai_recommendation;
    
    if (aiRecommendation && typeof aiRecommendation === 'object') {
      if (aiRecommendation.ai_recommendation) {
        aiRecommendationString = aiRecommendation.ai_recommendation;
        annualSavings = aiRecommendation.annual_savings_inr || 0;
        paybackPeriod = aiRecommendation.payback_period_years || 0;
      } else {
        aiRecommendationString = JSON.stringify(aiRecommendation);
      }
    } else if (typeof aiRecommendation === 'string') {
      aiRecommendationString = aiRecommendation;
    } else {
      aiRecommendationString = "Unable to generate recommendation due to processing error.";
    }

    // Extract GWL data
    const gwlData = response.data.gwl_data;
    let gwlPrediction = null;
    
    if (gwlData && gwlData.success) {
      gwlPrediction = gwlData.gwl;
      console.log("GWL prediction successful:", gwlPrediction, "mbgl");
    } else {
      console.log("GWL prediction not available:", gwlData?.error || "No GWL data");
    }

    // Update existing record or create new one
    let savedData;
    if (existingData) {
      // Update existing record
      existingData.ai_recommendation = aiRecommendationString;
      existingData.latitude = parseFloat(latitude);
      existingData.longitude = parseFloat(longitude);
      existingData.area = parseFloat(area);
      existingData.district = district || "Unknown";
      existingData.gwl = gwlPrediction;
      existingData.annual_savings_inr = annualSavings;
      existingData.payback_period_years = paybackPeriod;
      
      savedData = await existingData.save();
      console.log("Data updated successfully:", savedData._id);
    } else {
      // Create new record
      const newDataEntry = new Data({
        userId: userId,
        ai_recommendation: aiRecommendationString,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        area: parseFloat(area),
        district: district || "Unknown",
        gwl: gwlPrediction,
        annual_savings_inr: annualSavings,
        payback_period_years: paybackPeriod
      });

      savedData = await newDataEntry.save();
      console.log("New data created successfully:", savedData._id);
    }

    // Return enhanced response
    return res.status(200).json({
      ai_recommendation: aiRecommendationString,
      annual_savings_inr: annualSavings,
      payback_period_years: paybackPeriod,
      gwl: gwlPrediction,
      gwl_unit: gwlPrediction ? "mbgl" : null,
      gwl_available: gwlPrediction !== null,
      dataId: savedData._id,
      message: existingData ? "Data updated successfully" : "Data processed and saved successfully",
      isUpdate: !!existingData
    });

  } catch (error) {
    console.error("Error in process controller:", error.response ? error.response.data : error.message);

    if (error.response && error.response.data) {
      return res.status(500).json({
        message: "Error from AI service",
        error: error.response.data,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error while saving data.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error while processing request.",
      error: error.message,
    });
  }
};