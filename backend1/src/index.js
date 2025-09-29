import express from "express";
import authRoutes from "./routes/auth.route.js";
import processRoutes from "./routes/process.route.js";
import dataRoutes from "./routes/data.route.js";
import contactRoutes from "./routes/contact.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import dotenv from "dotenv";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://jal-setu.vercel.app",
            "https://jal-setu-git-main-aayush-pandey05s-projects.vercel.app",
          ]
        : "http://localhost:5173",
    credentials: true,
  })
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "backend1-nodejs",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/processing", processRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    connectDb();
  });
} else {
  // Connect to database for production
  connectDb();
}

// Export for Vercel
export default app;
