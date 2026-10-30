const getAdminDashboard = (req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the Admin Dashboard",
        user:req.user
    })
}

module.exports={getAdminDashboard}