import { prisma } from '../db/prisma.js';


export const createTimeSlots = async (req, res) => {
    try {
        const { doctorId, date, slots } = req.body;

        if (!doctorId || !date || !slots || !Array.isArray(slots)) {
            return res.status(400).json({ message: "Doctor ID, Date, and Slots array are required" });
        }

        const createdSlots = [];
        for (const time of slots) {

            const existing = await prisma.timeSlot.findFirst({
                where: { doctorId, date, time }
            });

            if (!existing) {
                const slot = await prisma.timeSlot.create({
                    data: {
                        doctorId,
                        date,
                        time,
                        status: 'PENDING'
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


export const updateSlotStatus = async (req, res) => {
    try {
        const { slotId, status } = req.body;

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


export const approveSlot = async (req, res) => {
    try {
        const { slotId } = req.body;
        const doctorId = req.user.id;

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
