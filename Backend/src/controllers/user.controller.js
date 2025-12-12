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

        // Find the specific time slot
        const timeSlot = await prisma.timeSlot.findFirst({
            where: {
                doctorId,
                date,
                time,
                status: 'AVAILABLE' // Must be approved and available
            }
        });

        if (!timeSlot) {
            return res.status(400).json({ message: "This time slot is not available" });
        }

        // Create appointment and update slot status transactionally
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

        // Get all slots for this doctor/date
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

        // "bookedSlots" for frontend are any slots that are NOT 'AVAILABLE'
        // This effectively hides PENDING, FROZEN, and BOOKED slots from being selectable
        // Or we can send the raw status and let frontend decide.
        // For backward compatibility with frontend logic:
        // Frontend expects "bookedSlots" to disable them.
        // So we return times of all slots that are NOT 'AVAILABLE'.

        // Actually, better logic:
        // Frontend shows specific slots. If we only have "Time Slot" dropdown, we should only show AVAILABLE slots.
        // But current frontend has hardcoded slots and disables booked ones.
        // To support the new "Admin defines slots" model, the frontend should fetch *available* slots instead of hardcoded ones.
        // For now, let's stick to the contract: return "bookedSlots" as those not available.

        // However, the requirement is "Admin assigns time slot".
        // So the doctor might not have 9-5 slots anymore.
        // We should return the list of AVAILABLE slots to the frontend to populate the dropdown.

        const availableSlots = slots.filter(s => s.status === 'AVAILABLE').map(s => s.time);

        // We can also return "isFull" if no slots are available
        const isFull = availableSlots.length === 0;

        res.status(200).json({ isFull, availableSlots, allSlots: slots });
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
