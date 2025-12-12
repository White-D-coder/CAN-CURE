import express from 'express';
import {
    getD,
    getDocId,
    getDoctorAppointments,
    getPatientDetails,
    addPrescription,
    updatePrescription
} from '../controllers/doctor.controller.js';
import { getDoctorSlots, approveSlot } from '../controllers/schedule.controller.js';

import { verifyDoctor } from '../middleware/middleware.js';

const router = express.Router();

router.use(verifyDoctor);

router.get('/', getD);
router.get('/:id', getDocId);
router.get('/:id/appointments', getDoctorAppointments);
router.get('/:doctorId/patient/:patientId', getPatientDetails);
router.post('/:id/patient/:patientId/prescription', addPrescription);
router.put('/:id/patient/:patientId/prescription/:medId', updatePrescription);

// Schedule Management
router.get('/schedule', getDoctorSlots);
router.put('/schedule/approve', approveSlot);

export default router;
