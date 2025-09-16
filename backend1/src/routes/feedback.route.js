import express from "express";
import { feedbackFormHandler } from "../controller/feedback.controller.js";

const router = express.Router();

router.post("/", feedbackFormHandler );

export default router;