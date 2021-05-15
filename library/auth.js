const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const {JWT_secret}=require("../config")

const hashing = async(password)=>{
    try {
        const salt = await bcryptjs.genSalt(10)
        // console.log(salt)
        const hash = await bcryptjs.hash(password,salt)
        // console.log("hash::",hash)
        return hash;
    } catch (error) {
        return error;
    }
}

const hashCompare = async(password,hashValue)=>{
    try {
        return await bcryptjs.compare(password,hashValue)
    } catch (error) {
        
    }
}

const createJWT = async({email,id,role})=>{
    try {
        return await JWT.sign(
            {
                email,id,role
            },
            JWT_secret,
            { expiresIn: '1h' }
        )
    } catch (error) {
        return error;
    }
}

const authorize = async (req,res,next)=>{
    // chek for token
    const token = await req.headers["authorization"]
    if(token){
        // check for valid
        JWT.verify(token,JWT_secret,(err,decoded)=>{
            if(err){
                return res.json({err})
            }
            if(decoded !== undefined){
                req.body.auth = decoded;
                console.log(decoded)
                // allow the user
                next();
            }
        })
    }
    else{
        res.json({
            message:"No token available"
        })
    }
}

const rolePermit = (...roles)=>{
    return function(req,res,next){
        const role = req.body.auth.role;
        if(roles.includes(role)){
            next();
        }else{
            res.json({message:"Permission Denied"})
        }
    }
}


module.exports = {hashing, hashCompare, createJWT, authorize, rolePermit}