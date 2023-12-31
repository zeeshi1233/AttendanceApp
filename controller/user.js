const express=require('express');
const app=express();
const User=require('../Model/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs-extra");
const multer = require("multer");
const cloudinary = require("cloudinary");
const Joi=require('joi');

cloudinary.config({ 
  cloud_name: 'dyswvyoxb', 
  api_key: '159964144812614', 
  api_secret: 'K6K0JPbEIaB-ESU0dF7lgNkrRG8' 
});


const userSchema = Joi.object({
    name: Joi.string().required(),
    pic: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  

  const upload = multer({ storage: storage });


const router = express.Router();
app.use(express.json());

// Signup Api

router.post('/signup',upload.single('pic'),async(req,res)=>{
try {
    await userSchema.validateAsync(req.body);
    const {name,pic,email,password}=req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ status: 400, msg: 'User already exists' });
    }
    

    const hashPass=await bcrypt.hash(password,10);
     
    fs.readdirSync('images/').forEach(file=>{
        cloudinary.v2.uploader.upload(`images/${file}`,
 async function(error, result) {
    fs.remove(`images/${file}`,err=>{
        if(err) return console.error(err);
        console.log("Success");
    })
    if(error){
        return res.status(400).send({status:400,msg:error});
    }
    const userPic=result.url;
    const newUser=new User({name,pic:userPic,email,password:hashPass});
    const savedUser=await newUser.save();
   return res.status(200).send({status:'200',data:savedUser});

   });
    })
    
} catch (error) {
    return res.status(400).send({status:'400',error:error});
}
})

router.post('/login',async(req,res)=>{




})

module.exports=router