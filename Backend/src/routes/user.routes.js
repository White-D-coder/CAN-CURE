import express from 'express';
import { getPatientDashboard } from '../controllers/user.controller.js';
import { verifyPatient } from '../middleware/middleware.js';

const router = express.Router();

router.get('/dashboard', verifyPatient, getPatientDashboard);

export default router;
