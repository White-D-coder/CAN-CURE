import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
export const signupMiddleware = (req, res, next) => {
    const { username, email, password } = req.body
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Username,email and password are required" })
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: "Invalid email format" })
    }
    next()
}
export const loginMiddleware=(req,res,next)=>{
    const {email,password}=req.body
    const {authorization}=req.headers
    if (!email || !password){
        return res.status(400).json({message:"Email and password are required"})
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: "Invalid email format" })
    }
    if (!authorization.startsWith("Bearer")) {
        return res.status(401).json({ message: "unauthorized" })
    }
    const token = authorization.split(" ")[1]
    const decode = jwt.verify(token, JWT_SECRET)
    req.user = decode


    next()
}
