import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signupMiddleware = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Username, email and password are required" });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    next();
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Admins only' });
        }
    });
};

export const verifyDoctor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'doctor' || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Doctors only' });
        }
    });
};

export const verifyPatient = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'patient' || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Patients only' });
        }
    });
};
