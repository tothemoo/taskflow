const User = require('../models/User');

const createUser = async(req,res)=>{
    try{
        const{name,email,password}=req.body;

        const user = await User.create({
            name, email, password
        })

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user
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