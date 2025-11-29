import { prisma } from '../db/prisma.js';

const credoc = async (req, res) => {
    try {
        const { name, specialist, experience, email } = req.body;
        const doctor = await prisma.doctor.create({
            data: {
                name,
                specialist,
                experience,
                email
            }
        });
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getD = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany();
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getDocId = async (req, res) => {
    try {
        const ide = req.params.id;
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId: parseInt(ide) }
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const updateDoc = async (req, res) => {
    try {
        const ide = req.params.id;
        const { name, specialist, experience, email } = req.body;
        const doctor = await prisma.doctor.update({
            where: { doctorId: parseInt(ide) },
            data: {
                name,
                specialist,
                experience,
                email
            }
        });
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const delDoc = async (req, res) => {
    try {
        const ide = req.params.id;
        await prisma.doctor.delete({
            where: { doctorId: parseInt(ide) }
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    credoc,
    getD,
    getDocId,
    updateDoc,
    delDoc
}
