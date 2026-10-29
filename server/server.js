
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/db')
const User=require('./models/User');

const PORT = 8000;

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

