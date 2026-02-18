import express from 'express';
import multer from 'multer';
import { MedicinalController } from '../controllers/medicinal.controller.js';

const router = express.Router();
const medicinalController = new MedicinalController();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('report'), medicinalController.uploadReport);
router.post('/sync', medicinalController.syncCalendar);

export default router;
