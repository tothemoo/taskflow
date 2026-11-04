
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/db')
const User=require('./models/User');
const Project = require('./models/Project')
const ProjectMember = require("./models/ProjectMember")

const PORT = process.env.PORT || 8000;

User.hasMany(Project,{
    foreignKey:"userId",
    as:"projects"
});

Project.belongsTo(User,{
    foreignKey:"userId",
    as:"creator"
})

User.hasMany(ProjectMember, {
    foreignKey: "userId"
});

ProjectMember.belongsTo(User, {
    foreignKey: "userId"
});

User.belongsToMany(Project,{
    through: ProjectMember,
    foreignKey: "userId",
    otherKey: "projectId",
    as:"joinedProjects"
})

Project.belongsToMany(User,{
    through: ProjectMember,
    foreignKey:"projectId",
    otherKey:"userId",
    as:"members"
})

sequelize.sync()
    .then(()=>{
        console.log("Database synchronized successfully");

        app.listen(PORT,()=>{
        console.log(`Server is running on port:${PORT}`);
        })
    })
    .catch((error)=>{
        console.eror("Unable to connect to the database:",error)
    })

