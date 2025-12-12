import express from 'express';
import { getPatientDashboard, getAllDoctors, bookAppointment, getDoctorAvailability } from '../controllers/user.controller.js';
import { verifyPatient } from '../middleware/middleware.js';

const router = express.Router();

router.get('/dashboard', verifyPatient, getPatientDashboard);
router.get('/doctors', verifyPatient, getAllDoctors);
router.post('/book-appointment', verifyPatient, bookAppointment);
router.get('/availability', verifyPatient, getDoctorAvailability);

export default router;
