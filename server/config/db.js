const {Sequelize}=require('sequelize');

const sequelize = new Sequelize(
    "taskflow",
    "root",
    "",
    {
    host:"localhost",
    dialect:"mysql"
})

module.exports=sequelize;