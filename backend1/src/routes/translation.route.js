import express from "express";
import { translateContent } from "../controller/translation.controller.js";

const router = express.Router();

// This route will handle requests like GET /api/translate/hi
router.get("/:lang", translateContent);

export default router;