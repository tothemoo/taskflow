const express = require('express');
const app = express();

const userRoutes= require('./routes/userRoutes');

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("TaskFlow API is running")
})

app.use('/api/users',userRoutes);

module.exports = app;