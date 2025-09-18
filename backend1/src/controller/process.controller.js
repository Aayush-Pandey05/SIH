import axios from "axios";
import Data from "../models/data.model.js";

// Helper function to safely extract numeric values
const safeParseNumber = (value, defaultValue = 0) => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[₹,]/g, ''));
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

// Helper function to extract structure information from text
const parseStructureFromText = (text) => {
  try {
    if (!text) return null;

    let structure_type = "Unknown";
    let dimensions = "";
    
    // Extract structure type and dimensions
    if (text.includes("Recharge Pit")) {
      structure_type = "Recharge Pit";
      const pitMatch = text.match(/(\d+m?\s*x\s*\d+m?\s*x\s*\d+m?)/i);
      dimensions = pitMatch ? pitMatch[1] : "2m x 2m x 3m";
    } else if (text.includes("Recharge Trench")) {
      structure_type = "Recharge Trench";
      const trenchMatch = text.match(/(\d+\.?\d*m?\s*width.*?\d+\.?\d*m?\s*depth.*?\d+\.?\d*m?\s*length)/i);
      dimensions = trenchMatch ? trenchMatch[1] : "1.5m width, 2m depth, 10m length";
    } else if (text.includes("Recharge Shaft")) {
      structure_type = "Recharge Shaft";
      const shaftMatch = text.match(/(\d+\.?\d*m?\s*diameter.*?\d+\.?\d*m?\s*depth)/i);
      dimensions = shaftMatch ? shaftMatch[1] : "1m diameter, 18m depth";
    }

    // Extract cost
    const costMatch = text.match(/₹([\d,]+)/);
    const cost = costMatch ? parseInt(costMatch[1].replace(/,/g, '')) : 0;

    // Extract capacity
    const capacityMatch = text.match(/capacity[:\s]*(?:of\s*)?([\d,]+)\s*liters?/i);
    const capacity = capacityMatch ? parseInt(capacityMatch[1].replace(/,/g, '')) : 0;

    // Extract subsidy
    const subsidyMatch = text.match(/subsidy[:\s]*(?:of\s*)?₹([\d,]+)/i);
    const subsidy = subsidyMatch ? parseInt(subsidyMatch[1].replace(/,/g, '')) : 0;

    return {
      structure_type,
      dimensions,
      cost,
      capacity,
      subsidy
    };
  } catch (error) {
    console.log("Error parsing structure info:", error);
    return null;
  }
};

export const processRequest = async (req, res) => {
  const { latitude, longitude, area, district } = req.body;
  const userId = req.user.id;

  if (!latitude || !longitude || !area) {
    return res.status(400).json({
      message: "Incomplete data provided. Please provide latitude, longitude, and area.",
    });
  }

  try {
    const existingData = await Data.findOne({ userId: userId }).sort({ createdAt: -1 });
    
    if (existingData) {
      console.log("Found existing data for user:", userId);
      console.log("Will update existing record instead of creating new one");
    }

    const agentInputString = `Please generate a feasibility report for a rooftop located at latitude ${latitude}, longitude ${longitude}, with an area of ${area} square meters and district ${district}.`;

    const payload = {
      input: agentInputString,
      district: district || "Unknown",
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      area: parseFloat(area)
    };

    const fastApiUrl = "http://localhost:5000/get-recommendation-with-gwl";
    console.log("Forwarding request to enhanced FastAPI with payload:", payload);

    const response = await axios.post(fastApiUrl, payload);
    console.log("FastAPI Response:", JSON.stringify(response.data, null, 2));

    // Initialize default values
    let aiRecommendationString = "";
    let annualSavings = 0;
    let paybackPeriod = 0;
    let structureType = "";
    let structureDimensions = "";
    let estimatedCost = 0;
    let structureCapacity = 0;
    let subsidyAvailable = 0;
    let annualRainfall = 0;
    let runoffLiters = 0;
    
    const aiRecommendation = response.data.ai_recommendation;
    
    // Extract data from the response
    if (aiRecommendation && typeof aiRecommendation === 'object') {
      // Extract basic recommendation data
      aiRecommendationString = aiRecommendation.ai_recommendation || "";
      annualSavings = safeParseNumber(aiRecommendation.annual_savings_inr, 0);
      paybackPeriod = safeParseNumber(aiRecommendation.payback_period_years, 0);
      
      // Extract structured data if available
      if (aiRecommendation.structure_data) {
        const structData = aiRecommendation.structure_data;
        structureType = structData.suggested_structure || "";
        structureDimensions = structData.recommended_dimensions || "";
        estimatedCost = safeParseNumber(structData.estimated_cost_inr, 0);
        structureCapacity = safeParseNumber(structData.capacity_liters, 0);
        subsidyAvailable = safeParseNumber(structData.subsidy_available_inr, 0);
      }
      
      // Extract environmental data if available
      if (aiRecommendation.environmental_data) {
        const envData = aiRecommendation.environmental_data;
        annualRainfall = safeParseNumber(envData.annual_rainfall_mm, 0);
        runoffLiters = safeParseNumber(envData.runoff_liters, 0);
      }
    } else if (typeof aiRecommendation === 'string') {
      aiRecommendationString = aiRecommendation;
    } else {
      aiRecommendationString = "Unable to generate recommendation due to processing error.";
    }

    // If structured data is missing, try to parse from text
    if (!structureType && aiRecommendationString) {
      const parsedData = parseStructureFromText(aiRecommendationString);
      if (parsedData) {
        structureType = parsedData.structure_type;
        structureDimensions = parsedData.dimensions;
        estimatedCost = parsedData.cost || estimatedCost;
        structureCapacity = parsedData.capacity || structureCapacity;
        subsidyAvailable = parsedData.subsidy || subsidyAvailable;
      }
    }

    // Handle GWL data
    const gwlData = response.data.gwl_data;
    let gwlPrediction = null;
    
    if (gwlData && gwlData.success) {
      gwlPrediction = gwlData.gwl;
      console.log("GWL prediction successful:", gwlPrediction, "mbgl");
    } else {
      console.log("GWL prediction not available:", gwlData?.error || "No GWL data");
    }

    // Save or update data
    let savedData;
    const dataToSave = {
      ai_recommendation: aiRecommendationString,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      area: parseFloat(area),
      district: district || "Unknown",
      gwl: gwlPrediction,
      annual_savings_inr: annualSavings,
      payback_period_years: paybackPeriod,
      structure_type: structureType,
      structure_dimensions: structureDimensions,
      estimated_cost_inr: estimatedCost,
      structure_capacity_liters: structureCapacity,
      subsidy_available_inr: subsidyAvailable,
      annual_rainfall_mm: annualRainfall,
      runoff_liters: runoffLiters
    };

    if (existingData) {
      Object.assign(existingData, dataToSave);
      savedData = await existingData.save();
      console.log("Data updated successfully:", savedData._id);
    } else {
      const newDataEntry = new Data({
        userId: userId,
        ...dataToSave
      });
      savedData = await newDataEntry.save();
      console.log("New data created successfully:", savedData._id);
    }

    // Return comprehensive response
    return res.status(200).json({
      ai_recommendation: aiRecommendationString,
      annual_savings_inr: annualSavings,
      payback_period_years: paybackPeriod,
      structure_info: {
        structure: structureType,
        description: aiRecommendationString,
        cost: estimatedCost,
        capacity: structureCapacity,
        dimensions: structureDimensions,
        subsidy: subsidyAvailable
      },
      environmental_data: {
        annual_rainfall_mm: annualRainfall,
        runoff_liters: runoffLiters
      },
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