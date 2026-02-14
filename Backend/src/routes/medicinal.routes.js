import express from 'express';
import multer from 'multer';
import { uploadReport, syncCalendar } from '../controllers/medicinal.controller.js';

const router = express.Router();
// Use memory storage for OCR (files don't need to be saved to disk effectively)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('report'), uploadReport);
router.post('/sync', syncCalendar);

export default router;
