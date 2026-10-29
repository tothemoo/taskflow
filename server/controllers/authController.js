const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login= async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({
            where:{
                email
            }
        });

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const passwordMatch = await bcrypt.compare(password,user.password)

        if(!passwordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const token =jwt.sign({
            id:user.id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET,{
            expiresIn:"1h"
        }
        );

    res.status(200).json({
        success:true,
        message:"login successful",
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role
        }
    })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Failed to login",
        })
    }
}

module.exports={login}