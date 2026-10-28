const User = require('../models/User');
const bcrypt = require('bcrypt');

const createUser = async(req,res)=>{
    try{
        const{name,email,password}=req.body;

        const hashedPassword = await bcrypt.hash(password, 10);     

        const user = await User.create({
            name, email, password: hashedPassword
        })

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user: userResponse
        })
    }
   catch(error){
    console.error(error);
    res.status(500).json({
        success:false,
        message:"Failed to create user",
    })
   }
}

module.exports={createUser}