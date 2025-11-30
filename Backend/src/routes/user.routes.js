import express from "express";
import { prisma } from "../db/prisma";
const router = express.Router();
router.get("/dashboard", async (req, res) => {
  if (req.user == "Admin") {
    const time = await prisma.doctor.findMany({
      where: { status: "Active" },
      select: { time: true },
    });
    const upcoming = await prisma.appointment.findMany({
      select: { patientName: true, doctor: true, time: true, date: true },
    });
    const doc = await prisma.doctor.findMany({
      select: { name: true, status: true },
    });
    return res.status(200).json({ time, upcoming, doc });
  }
});
router.get("/profile/:id", async (req, res) => {
    if (req.user=="Patient"){
        const prof= await prisma.user.findUnique({
            where:{id:id},
            include:{
                Appointments:{
                    select:{
                    date:true,
                    time:true,
                    doctor:{
                        name:true,
                        specialist:true
                    }
                }},
                Medicine:true,
                CancerType:true
            }
        })
        return res.status(200).json({prof})

    }
});
