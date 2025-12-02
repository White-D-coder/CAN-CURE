import { prisma } from '../db/prisma.js';

export const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const appointments = await prisma.appointment.findMany({
            where: { doctorId: doctorId },
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
                doctorId: doctorId,
                userId: patientId
            }
        });

        if (!appointment) {
            return res.status(403).json({ message: "Access denied. No appointment found with this patient." });
        }

        const patientData = await prisma.user.findUnique({
            where: { id: patientId },
            include: {
                medicines: true,
                CancerType: true,
                Reports: true,
                Appointments: {
                    where: { doctorId: doctorId }
                }
            }
        });

        res.status(200).json(patientData);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getD = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany();
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getDocId = async (req, res) => {
    try {
        const ide = req.params.id;
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId: ide }
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
            where: { doctorId: ide },
            data: {
                name,
                specialist,
                experience,
                email,
                password
            }
        });
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const delDoc = async (req, res) => {
    try {
        const ide = req.params.id;
        await prisma.doctor.delete({
            where: { doctorId: ide }
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ err: err.text });
    }
};
