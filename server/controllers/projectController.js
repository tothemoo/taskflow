const Project = require('../models/Project')
const {redisClient} = require('../config/redis')

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

        await redisClient.del(`projects:user:${req.user.id}`)

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


const getProjects = async (req, res) => {
    const cacheKey = `projects:user:${req.user.id}`;

    try {
        // 1. Try retrieving projects from Redis
        if (redisClient.isReady) {
            try {
                const cachedProjects = await redisClient.get(cacheKey);

                if (cachedProjects) {
                    console.log("Projects fetched from Redis");

                    return res.status(200).json({
                        success: true,
                        source: "redis",
                        projects: JSON.parse(cachedProjects)
                    });
                }
            } catch (redisError) {
                console.error("Redis read failed:", redisError.message);
            }
        }

        // 2. Fetch projects from MySQL
        console.log("Projects fetched from MySQL");

        const projects = await Project.findAll({
            where: {
                userId: req.user.id
            },
            order: [["createdAt", "DESC"]]
        });

        // 3. Try saving projects in Redis
        if (redisClient.isReady) {
            try {
                await redisClient.setEx(
                    cacheKey,
                    60,
                    JSON.stringify(projects)
                );
            } catch (redisError) {
                console.error("Redis cache save failed:", redisError.message);
            }
        }

        // 4. Return projects regardless of Redis availability
        return res.status(200).json({
            success: true,
            source: "mysql",
            count: projects.length,
            projects
        });

    } catch (error) {
        console.error("Get projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch projects"
        });
    }
};


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

        await redisClient.del(`projects:user:${req.user.id}`)

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

        await redisClient.del(`projects:user:${req.user.id}`)

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