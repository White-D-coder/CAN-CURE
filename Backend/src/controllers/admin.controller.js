<<<<<<< HEAD
import { prisma } from '../db/prisma.js';
import bcrypt from 'bcryptjs';

export const getStats = async (req, res) => {
    try {
        const doctorCount = await prisma.doctor.count();
        const userCount = await prisma.user.count();
        const appointmentCount = await prisma.appointment.count();

        res.status(200).json({
            doctors: doctorCount,
            patients: userCount,
            appointments: appointmentCount
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: { Appointments: true }
                }
            }
        });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            select: {
                doctorId: true,
                name: true,
                specialist: true,
                experience: true,
                email: true,
                _count: {
                    select: { appointments: true }
                }
            }
        });
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const createDoctor = async (req, res) => {
    try {
        const { name, specialist, experience, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
=======
export const credoc = async (req, res) => {
    try {
        const { name, specialist, experience, email, password } = req.body;
>>>>>>> f3899da (feat: api and folder structure)
        const doctor = await prisma.doctor.create({
            data: {
                name,
                specialist,
<<<<<<< HEAD
                experience: parseInt(experience),
                email,
                password: hashedPassword
            }
        });
        res.status(201).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialist, experience, email, password } = req.body;
        const data = {
            name,
            specialist,
            experience: parseInt(experience),
            email
        };
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }
        const doctor = await prisma.doctor.update({
            where: { doctorId: parseInt(id) },
            data
        });
=======
                experience,
                email,
                password: password || 'password123'
            }
        });
>>>>>>> f3899da (feat: api and folder structure)
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

<<<<<<< HEAD
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.doctor.delete({
            where: { doctorId: parseInt(id) }
        });
        res.status(200).json({ message: 'Doctor deleted successfully' });
=======
export const getD = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany();
        res.status(200).json(doctors);
>>>>>>> f3899da (feat: api and folder structure)
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

<<<<<<< HEAD
export const createPatient = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        res.status(201).json(user);
=======
export const getDocId = async (req, res) => {
    try {
        const ide = req.params.id;
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId: parseInt(ide) }
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doc not found' });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const updateDoc = async (req, res) => {
    try {
        const ide = req.params.id;
        const { name, specialist, experience, email, password } = req.body;
        const doctor = await prisma.doctor.update({
            where: { doctorId: parseInt(ide) },
            data: {
                name,
                specialist,
                experience,
                email,
                password
            }
        });
        res.status(200).json(doctor);
>>>>>>> f3899da (feat: api and folder structure)
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

<<<<<<< HEAD
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const data = { name, email };
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({ message: 'Patient deleted successfully' });
=======
export const delDoc = async (req, res) => {
    try {
        const ide = req.params.id;
        await prisma.doctor.delete({
            where: { doctorId: parseInt(ide) }
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ err: err.text });
    }
};


export const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const appointments = await prisma.appointment.findMany({
            where: { doctorId: parseInt(doctorId) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getPatientDetails = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;

        // Verify appointment exists between doctor and patient
        const appointment = await prisma.appointment.findFirst({
            where: {
                doctorId: parseInt(doctorId),
                userId: parseInt(patientId)
            }
        });

        if (!appointment) {
            return res.status(403).json({ message: "Access denied. No appointment found with this patient." });
        }

        const patientData = await prisma.user.findUnique({
            where: { id: parseInt(patientId) },
            include: {
                medicines: true,
                CancerType: true,
                Reports: true,
                Appointments: {
                    where: { doctorId: parseInt(doctorId) }
                }
            }
        });

        res.status(200).json(patientData);
>>>>>>> f3899da (feat: api and folder structure)
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
