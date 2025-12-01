import express from 'express';
<<<<<<< HEAD
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

const router = express.Router();

router.get('/stats', getStats);

router.get('/doctors', getAllDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

router.get('/patients', getAllUsers);
router.post('/patients', createPatient);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);
=======
<<<<<<<< HEAD:Backend/src/routes/doctor.routes.js
import { getD, getDocId, getDoctorAppointments, getPatientDetails } from '../controllers/doctor.controller.js';

const router = express.Router();

========
import { credoc, getD, getDocId, updateDoc, delDoc } from '../controllers/admin.controller.js';

const router = express.Router();
//crud operation that can be done by admin on doctor
router.post('/', credoc);
>>>>>>>> f3899da (feat: api and folder structure):Backend/src/routes/admin.routes.js
router.get('/', getD);
router.get('/:id', getDocId);
router.get('/:id/appointments', getDoctorAppointments);
router.get('/:doctorId/patient/:patientId', getPatientDetails);
>>>>>>> f3899da (feat: api and folder structure)

export default router;
