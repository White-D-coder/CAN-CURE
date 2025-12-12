import { prisma } from '../db/prisma.js';

// Admin: Create time slots for a doctor
export const createTimeSlots = async (req, res) => {
    try {
        const { doctorId, date, slots } = req.body; // slots is array of times ["09:00", "10:00"]

        if (!doctorId || !date || !slots || !Array.isArray(slots)) {
            return res.status(400).json({ message: "Doctor ID, Date, and Slots array are required" });
        }

        const createdSlots = [];
        for (const time of slots) {
            // Check if slot already exists
            const existing = await prisma.timeSlot.findFirst({
                where: { doctorId, date, time }
            });

            if (!existing) {
                const slot = await prisma.timeSlot.create({
                    data: {
                        doctorId,
                        date,
                        time,
                        status: 'PENDING' // Default status
                    }
                });
                createdSlots.push(slot);
            }
        }

        res.status(201).json({ message: "Time slots created", createdSlots });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Admin: Freeze or Unfreeze a slot
export const updateSlotStatus = async (req, res) => {
    try {
        const { slotId, status } = req.body; // status: 'FROZEN' or 'PENDING' (if unfreezing)

        if (!slotId || !status) {
            return res.status(400).json({ message: "Slot ID and Status are required" });
        }

        const slot = await prisma.timeSlot.update({
            where: { id: slotId },
            data: { status }
        });

        res.status(200).json({ message: "Slot status updated", slot });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Doctor/Admin: Get slots for a doctor
export const getDoctorSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        const where = { doctorId };
        if (date) where.date = date;

        const slots = await prisma.timeSlot.findMany({
            where,
            orderBy: { time: 'asc' }
        });

        res.status(200).json(slots);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Doctor: Approve a slot
export const approveSlot = async (req, res) => {
    try {
        const { slotId } = req.body;
        const doctorId = req.user.id; // From verifyDoctor middleware

        const slot = await prisma.timeSlot.findUnique({
            where: { id: slotId }
        });

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        if (slot.doctorId !== doctorId) {
            return res.status(403).json({ message: "Unauthorized to approve this slot" });
        }

        const updatedSlot = await prisma.timeSlot.update({
            where: { id: slotId },
            data: { status: 'AVAILABLE' }
        });

        res.status(200).json({ message: "Slot approved", slot: updatedSlot });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
