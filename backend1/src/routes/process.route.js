import express from 'express';
import { processRequest } from '../controller/process.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/",protectRoute, processRequest);

export default router;