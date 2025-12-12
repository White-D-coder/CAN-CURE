import express from 'express';
import {
    getStats,
    getAllUsers,
    getAllDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createPatient,
    updatePatient,
    deletePatient
} from '../controllers/admin.controller.js';
import { createTimeSlots, updateSlotStatus, getDoctorSlots } from '../controllers/schedule.controller.js';

import { verifyAdmin } from '../middleware/middleware.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/stats', getStats);

router.get('/doctors', getAllDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

router.get('/patients', getAllUsers);
router.post('/patients', createPatient);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

// Schedule Management
router.post('/schedule/create', createTimeSlots);
router.put('/schedule/status', updateSlotStatus);
router.get('/schedule', getDoctorSlots);

export default router;
