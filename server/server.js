const express = require('express');
const app = express();
const PORT = 8000;

app.get('/',(req,res)=>{
    res.send("TaskFlow API is running")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port:${PORT}`);
})