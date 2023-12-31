const express=require("express");
const user =require('../controller/user.js');
const router = express.Router()
router.use('/user',user);



module.exports=router;