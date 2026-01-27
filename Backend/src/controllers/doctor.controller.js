import { prisma } from '../db/prisma.js';

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
        const { id } = req.params;
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId: id }
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doc not found' });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getDoctorAppointments = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await prisma.appointment.findMany({
            where: { doctorId: id },
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

export const addPrescription = async (req, res) => {
    try {
        const { id, patientId } = req.params;
        const { medName, description, dose, frequency, startDate, endDate } = req.body;

        const appointment = await prisma.appointment.findFirst({
            where: {
                doctorId: id,
                userId: patientId
            }
        });

        if (!appointment) {
            return res.status(403).json({ message: "Access denied. No appointment found with this patient." });
        }

        const medicine = await prisma.medicine.create({
            data: {
                medName,
                description,
                dose,
                frequency,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                userId: patientId,
                doctorId: id
            }
        });

        res.status(201).json(medicine);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const updatePrescription = async (req, res) => {
    try {
        const { id, patientId, medId } = req.params;
        const { medName, description, dose, frequency, startDate, endDate } = req.body;

        const appointment = await prisma.appointment.findFirst({
            where: {
                doctorId: id,
                userId: patientId
            }
        });

        if (!appointment) {
            return res.status(403).json({ message: "Access denied. No appointment found with this patient." });
        }

        const medicine = await prisma.medicine.update({
            where: { medId: medId },
            data: {
                medName,
                description,
                dose,
                frequency,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
        });

        res.status(200).json(medicine);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
