import express from 'express';
import { getStats, getAllUsers, getAllDoctors } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/doctors', getAllDoctors);

export default router;
