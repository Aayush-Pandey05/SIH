import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ai_recommendation: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    gwl: {
      type: Number,
      required: false,
    },
    annual_savings_inr: {
      type: Number,
      required: false,
      default: 0,
    },
    payback_period_years: {
      type: Number,
      required: false,
      default: 0,
    },
    // Additional structured fields
    structure_type: {
      type: String,
      required: false,
    },
    structure_dimensions: {
      type: String,
      required: false,
    },
    estimated_cost_inr: {
      type: Number,
      required: false,
      default: 0,
    },
    structure_capacity_liters: {
      type: Number,
      required: false,
      default: 0,
    },
    subsidy_available_inr: {
      type: Number,
      required: false,
      default: 0,
    },
    annual_rainfall_mm: {
      type: Number,
      required: false,
    },
    runoff_liters: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Data = mongoose.model("Data", dataSchema);

export default Data;
