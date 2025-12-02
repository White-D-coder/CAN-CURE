import express from 'express';
import { createReport, getReportsByPatient, updateReport } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/', createReport);
router.get('/patient/:userId', getReportsByPatient);
router.patch('/:id', updateReport);

export default router;
