const Project = require('../models/Project')

const createProject = async (req, res)=>{
    try{
        const {name, description} = req.body

        if (!name || !name.trim()){
            return res.status(400).json({
                success:false,
                message:"Project name is required"
            })
        }

        const project = await Project.create({
            name:name.trim(),
            description,
            userId:req.user.id
        })

        res.status(201).json({
            success: true,
            message:"Project created successfully",
            project
        })
    }
    catch(error){
        console.error(error)

        res.status(500).json({
            success:false,
            message:"unable to create project"
        })
    }
}

const getProjects = async(req,res)=>{
    try{
        const projects = await Project.findAll({
            where:{
                userId: req.user.id
            },
            order:[["createdAt","DESC"]]
        })

        res.status(200).json({
            success:true,
            count:projects.length,
            projects
        })
    }

    catch(error){
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch projects"
        })
    }
}

const getProjectById = async(req,res)=>{
    try{
        const project = await Project.findOne({
            where:{
                id:req.params.id,
                userId:req.user.id
            }
        });

        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            })
        }

        res.status(200).json({
            success:true,
            project
        })
    }
    catch(error){
        console.error(error)

        res.status(500).json({
            success:false,
            message:"Unable to fetch project"
        })
    }
}

const updateProject = async(req,res)=>{
    try{
        const{name, description, status} = req.body;

        const project = await Project.findOne({
            where:{
                id:req.params.id,
                userId:req.user.id
            }
        })

        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            })
        }

        await project.update({
            name:name!==undefined?name.trim():project.name,
            description:description!==undefined?description.trim():project.description,
            status:status!==undefined?status:project.status
        })

        res.status(200).json({
            success:true,
            message:"Project updated successfully",
            project
        })
    }

    catch(error){
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Unable to update project"
        })
    }
}

const deleteProject = async(req,res)=>{
    try{
        const project=await Project.findOne({
            where:{
                id:req.params.id,
                userId:req.user.id
            }
        })

        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            })
        }

        await project.destroy();

        res.status(200).json({
            success:true,
            message:"Project deleted successfully"
        })
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Unable to delete project"
        })
    }
}


module.exports={
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
}