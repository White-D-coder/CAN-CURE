import { prisma } from '../db/prisma.js';

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
