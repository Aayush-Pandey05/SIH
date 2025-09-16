import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
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
}, // Removed the extra closing brace here
{ timestamps: true }
);

const Data = mongoose.model("Data", dataSchema);

export default Data;