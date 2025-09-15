import express from "express";
import authRoutes from "./routes/auth.route.js";
import processRoutes from "./routes/process.route.js";
import dataRoutes from "./routes/data.route.js"
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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/processing", processRoutes);
app.use("/api/data", dataRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  connectDb();
});
