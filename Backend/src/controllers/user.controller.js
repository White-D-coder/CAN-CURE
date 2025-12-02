import { prisma } from '../db/prisma.js';

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            select: {
                doctorId: true,
                name: true,
                specialist: true,
                experience: true
            }
        });
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const bookAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { doctorId, date, time, patientName } = req.body;

        if (!doctorId || !date || !time || !patientName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const appointment = await prisma.appointment.create({
            data: {
                date,
                time,
                patientName,
                doctorId,
                userId
            }
        });

        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getPatientDashboard = async (req, res) => {
    try {
        const userId = req.user.id; // From verifyToken middleware

        const patient = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                Appointments: {
                    include: {
                        doctor: {
                            select: {
                                name: true,
                                specialist: true
                            }
                        }
                    }
                },
                medicines: {
                    include: {
                        doctor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                Reports: {
                    include: {
                        doctor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                CancerType: true
            }
        });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
