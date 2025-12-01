import express from 'express';
import { createReport, getReportsByPatient } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/', createReport);
router.get('/patient/:userId', getReportsByPatient);

export default router;
