import express from "express";
import { contactFormHandler } from "../controller/contact.controller.js";

const router = express.Router();

router.post("/", contactFormHandler );

export default router;