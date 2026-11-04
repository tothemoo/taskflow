
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/db');
const { connectRedis } = require('./config/redis');

const User = require('./models/User');
const Project = require('./models/Project');
const ProjectMember = require('./models/ProjectMember');

const PORT = process.env.PORT || 8000;

// User - Project associations
User.hasMany(Project, {
    foreignKey: "userId",
    as: "projects"
});

Project.belongsTo(User, {
    foreignKey: "userId",
    as: "creator"
});

// User - ProjectMember associations
User.hasMany(ProjectMember, {
    foreignKey: "userId"
});

ProjectMember.belongsTo(User, {
    foreignKey: "userId"
});

// Many-to-many associations
User.belongsToMany(Project, {
    through: ProjectMember,
    foreignKey: "userId",
    otherKey: "projectId",
    as: "joinedProjects"
});

Project.belongsToMany(User, {
    through: ProjectMember,
    foreignKey: "projectId",
    otherKey: "userId",
    as: "members"
});

// Start the application
const startServer = async () => {
    try {
        await sequelize.sync();

        console.log("Database synchronized successfully");

        await connectRedis();

        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

    } catch (error) {
        console.error("Unable to start the server:", error);
    }
};

startServer();
