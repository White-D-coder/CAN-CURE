import { prisma } from '../db/prisma.js';

export const createReport = async (req, res) => {
    try {
        const { reportName, reportUrl, userId, doctorId } = req.body;
        const report = await prisma.report.create({
            data: {
                reportName,
                reportUrl,
                userId: parseInt(userId),
                doctorId: doctorId ? parseInt(doctorId) : null
            }
        });
        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const getReportsByPatient = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reports = await prisma.report.findMany({
            where: { userId: parseInt(userId) }
        });
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
