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
        const doctor = await prisma.doctor.create({
            data: {
                name,
                specialist,
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
            where: { doctorId: id },
            data
        });
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.doctor.delete({
            where: { doctorId: id }
        });
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

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
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const data = { name, email };
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }
        const user = await prisma.user.update({
            where: { id: id },
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
            where: { id: id }
        });
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
