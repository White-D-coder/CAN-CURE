import express from 'express';
import { ReportController } from '../controllers/report.controller.js';

const router = express.Router();
const reportController = new ReportController();

router.post('/', reportController.createReport);
router.get('/patient/:userId', reportController.getReportsByPatient);
router.patch('/:id', reportController.updateReport);

export default router;
