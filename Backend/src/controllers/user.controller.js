import { prisma } from '../db/prisma.js';

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
