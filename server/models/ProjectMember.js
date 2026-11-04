const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectMember = sequelize.define("ProjectMember", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "member"
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["userId", "projectId"]
        }
    ]
});

module.exports = ProjectMember;