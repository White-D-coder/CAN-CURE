
 export const signupMiddleware=(req,res,next)=>{
    const{username,email,password}=req.body
    if (!email || !password || !username){
        return res.status(400).json({message:"Username,email and password are required"})
    }
    if (!email.includes('@')){
        return res.status(400).json({message:"Invalid email format"})
    }
    next()
}
export const loginMiddleware=(req,res,next)=>{
    const {email,password}=req.body
    if (!email || !password){
        return res.status(400).json({message:"Email and password are required"})
    }
    if (!email.includes('@')){
        return res.status(400).josn({message:"Invalid email format"})
    }
    next()
}