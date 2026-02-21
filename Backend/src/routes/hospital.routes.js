import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create Hospital
router.post('/', async (req, res) => {
    try {
        const { name, address, city, contact, email } = req.body;
        const hospital = await prisma.hospital.create({
            data: { name, address, city, contact, email }
        });
        res.status(201).json(hospital);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all Hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await prisma.hospital.findMany({
            include: {
                _count: {
                    select: { doctors: true }
                }
            }
        });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Hospital by ID
router.get('/:id', async (req, res) => {
    try {
        const hospital = await prisma.hospital.findUnique({
            where: { id: req.params.id },
            include: {
                doctors: true,
                appointments: {
                    include: {
                        doctor: true,
                        user: true
                    }
                }
            }
        });
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Hospital
router.put('/:id', async (req, res) => {
    try {
        const { name, address, city, contact, email } = req.body;
        const hospital = await prisma.hospital.update({
            where: { id: req.params.id },
            data: { name, address, city, contact, email }
        });
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Hospital
router.delete('/:id', async (req, res) => {
    try {
        await prisma.hospital.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Hospital deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
