const getProfile = (req,res)=>{
    res.status(200).json({
        success:true,
        message:"Protected profile accessed successfully",
        user:req.user
    })
}

module.exports={getProfile}