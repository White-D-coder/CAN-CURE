import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verifyPatient } from '../middleware/middleware.js';

const router = express.Router();
const userController = new UserController();

router.get('/dashboard', verifyPatient, userController.getPatientDashboard);
router.get('/doctors', verifyPatient, userController.getAllDoctors);
router.post('/book-appointment', verifyPatient, userController.bookAppointment);
router.get('/availability', verifyPatient, userController.getDoctorAvailability);

export default router;
