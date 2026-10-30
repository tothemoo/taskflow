const express = require('express');
const app = express();
const cors =require('cors');

const userRoutes= require('./routes/userRoutes');
const authRoutes=require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes')

app.use(cors({
     origin: "http://localhost:5173"
}))

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("TaskFlow API is running")
})

app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/profile',profileRoutes);

module.exports = app;