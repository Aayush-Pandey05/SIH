import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserData } from "../controller/data.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserData);

export default router;
