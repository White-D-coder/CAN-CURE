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


        const timeSlot = await prisma.timeSlot.findFirst({
            where: {
                doctorId,
                date,
                time,
                status: 'AVAILABLE'
            }
        });

        if (!timeSlot) {
            return res.status(400).json({ message: "This time slot is not available" });
        }


        const result = await prisma.$transaction(async (prisma) => {
            const appointment = await prisma.appointment.create({
                data: {
                    date,
                    time,
                    patientName,
                    doctorId,
                    userId,
                    timeSlotId: timeSlot.id
                }
            });

            await prisma.timeSlot.update({
                where: { id: timeSlot.id },
                data: { status: 'BOOKED' }
            });

            return appointment;
        });

        res.status(201).json({ message: "Appointment booked successfully", appointment: result });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getDoctorAvailability = async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({ message: "Doctor ID and Date are required" });
        }


        const slots = await prisma.timeSlot.findMany({
            where: {
                doctorId: doctorId,
                date: date
            },
            select: {
                time: true,
                status: true
            }
        });



        const availableSlots = slots.filter(s => s.status === 'AVAILABLE').map(s => s.time);


        const isFull = availableSlots.length === 0;

        res.status(200).json({ isFull, availableSlots, allSlots: slots });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getPatientDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

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
