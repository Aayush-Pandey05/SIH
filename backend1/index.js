import express from "express";
// Corrected paths start with "./src/"
import authRoutes from "./src/routes/auth.route.js";
import processRoutes from "./src/routes/process.route.js";
import dataRoutes from "./src/routes/data.route.js";
import contactRoutes from "./src/routes/contact.route.js";
import feedbackRoutes from "./src/routes/feedback.route.js";
import translationRoutes from "./src/routes/translation.route.js";
import dotenv from "dotenv";
import { connectDb } from "./src/lib/db.js"; // Assuming db.js is in 'lib' at the root
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// These lines remain the same
app.use("/api/auth", authRoutes);
app.use("/api/processing", processRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/translate", translationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  connectDb();
});