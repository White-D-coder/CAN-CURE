import { prisma } from '../db/prisma.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import { signupMiddleware } from '../middleware/middleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

import doctorRoutes from '../routes/doctor.routes.js';
import adminRoutes from '../routes/admin.routes.js';
import reportRoutes from '../routes/report.routes.js';
import userRoutes from '../routes/user.routes.js';

import cors from 'cors';
const app = express()
app.use(cors());
app.use(express.json())

app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);

app.post('/signup', signupMiddleware, async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        if (user) {
            return res.status(409).json({ message: "User  already exists" })
        }
        const newpassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: { name: username, email: email, password: newpassword }
        })
        const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1h' })

        return res.status(201).json({ message: "User created", token })


    }

    catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
app.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const admin = await prisma.admin.findUnique({ where: { username: identifier } });
        if (admin) {
            const isMatch = password === admin.password || await bcrypt.compare(password, admin.password);

            if (isMatch) {
                const token = jwt.sign({ id: admin.adminId, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ message: "Login successful", token, role: 'admin', user: { id: admin.adminId, username: admin.username, role: 'admin' } });
            }
        }

        const doctor = await prisma.doctor.findUnique({ where: { email: identifier } });
        if (doctor) {
            const isMatch = await bcrypt.compare(password, doctor.password);
            if (isMatch || password === doctor.password) {
                const token = jwt.sign({ id: doctor.doctorId, role: 'doctor' }, JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ message: "Login successful", token, role: 'doctor', user: { id: doctor.doctorId, name: doctor.name, email: doctor.email, role: 'doctor' } });
            }
        }

        const user = await prisma.user.findUnique({ where: { email: identifier } });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user.id, role: 'patient' }, JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ message: "Login successful", token, role: 'patient', user: { id: user.id, name: user.name, email: user.email, role: 'patient' } });
            }
        }

        return res.status(401).json({ message: "Invalid credentials" });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

})
app.listen(3000, () => {
    console.log("Server started on port 3000 - SERVER UPDATED")
})
export default app;