const Project = require("../models/Project");
const User = require("../models/User")
const ProjectMember = require("../models/ProjectMember")

const addProjectMember = async(req,res)=>{
    try{
        const {email} = req.body;
        const {id} = req.params;
    

    if(!email){
        return res.status(400).json({
            success: false,
            message:"Email is required"
        })
    }

    const project = await Project.findOne({
        where:{
            id, 
            userId: req.user.id
        }
    })

    if(!project){
        return res.status(404).json({
            success: false,
            message: "Project not found or you are not the owner"
        })
    }

    const user = await User.findOne({
        where:{email}
    })

    if(!user){
        return res.status(404).json({
            success:false,
            message: "User not found"
        })
    }

    if(user.id === req.user.id){
        return res.status(400).json({
            success:false,
            message:"You are already the project owner"
        })
    }

    const existingUser = await ProjectMember.findOne({
        where:{
            userId: user.id,
            projectId: project.id
        }
    })

    if(existingUser){
        return res.status(409).json({
            success:false,
            message:"User is already a project member"
        })
    }

    await ProjectMember.create({
        userId: user.id,
        projectId: project.id,
        role: "member"
    })

    return res.status(201).json({
        success:true,
        message:"Member added successfully"
    })
    }

    catch(error){
        console.error("Add project member error:", error);

        return res.status(500).json({
            success:false,
            message:"Unable to add project member"
        })
    }
}

const getProjectMembers = async (req, res) => {
    try {
        const { id } = req.params;

        // Check whether the project exists
        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // Check whether the logged-in user is the owner
        // or an existing member
        const isOwner = project.userId === req.user.id;

        const membership = await ProjectMember.findOne({
            where: {
                projectId: id,
                userId: req.user.id
            }
        });

        if (!isOwner && !membership) {
            return res.status(403).json({
                success: false,
                message: "You do not have access to this project."
            });
        }

        // Retrieve all project members
        const members = await ProjectMember.findAll({
            where: {
                projectId: id
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            members
        });

    } catch (error) {
        console.error("Get project members error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve project members."
        });
    }
};

const removeProjectMember = async (req, res) => {
    try {
        const { id, userId } = req.params;

        // Check whether the project belongs to the logged-in user
        const project = await Project.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner."
            });
        }

        // Find the membership record
        const member = await ProjectMember.findOne({
            where: {
                projectId: id,
                userId
            }
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Project member not found."
            });
        }

        // Remove the member
        await member.destroy();

        return res.status(200).json({
            success: true,
            message: "Project member removed successfully."
        });

    } catch (error) {
        console.error("Remove project member error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to remove project member."
        });
    }
};

module.exports = {
    addProjectMember,
    getProjectMembers,
    removeProjectMember
};