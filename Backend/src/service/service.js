import { prisma } from '../db/prisma.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import { loginMiddleware, signupMiddleware } from '../middleware/middleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
import doctorRoutes from '../routes/doctor.routes.js';

import cors from 'cors';
const app = express()
app.use(cors());
app.use(express.json())

app.use('/api/doctors', doctorRoutes);

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
        const { email, password } = req.body
        const find = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!find) {
            return res.status(404).json({ message: "No user found" })
        }
        const ismatch = await bcrypt.compare(password, find.password)
        if (!ismatch) {
            return res.status(401).json({ message: "Invalid password" })
        }
        const token2 = jwt.sign({ email: find.email }, JWT_SECRET, { expiresIn: '1h' })

        return res.status(200).json({ message: "Login successful", token2 })


    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
app.listen(3000, () => {
    console.log("Server started on port 3000 - SERVER UPDATED")
})
export default app;