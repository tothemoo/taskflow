const express = require('express');
const protect = require('../middleware/authMiddleware');

const {getProfile}=require('../controllers/profileController');

const router = express.Router();

router.get("/",protect,getProfile);

module.exports=router;