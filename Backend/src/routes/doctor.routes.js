import express from 'express';
import { getD, getDocId, getDoctorAppointments, getPatientDetails } from '../controllers/doctor.controller.js';

const router = express.Router();

router.get('/', getD);
router.get('/:id', getDocId);
router.get('/:id/appointments', getDoctorAppointments);
router.get('/:doctorId/patient/:patientId', getPatientDetails);

export default router;
