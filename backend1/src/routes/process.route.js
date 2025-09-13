import express from 'express';
import { processRequest } from '../controller/process.controller.js';

const router = express.Router();

router.post("/", processRequest);

export default router;