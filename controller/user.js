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

router.post('/signup', upload.single('pic'), async (req, res) => {
  try {
      await userSchema.validateAsync(req.body);
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).send({ status: 400, msg: 'User already exists' });
      }

      const hashPass = await bcrypt.hash(password, 10);

      if (!req.file) {
          return res.status(400).send({ status: 400, msg: 'Please upload an image' });
      }

      // Create the user in MongoDB
      const newUser = new User({ name, email, password: hashPass });
      const savedUser = await newUser.save();

      // Upload the image to Cloudinary using the MongoDB ID as the public ID
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
          public_id: savedUser._id.toString(), // Using MongoDB ID as the public ID
      });

      const userPic = result.secure_url;

      // Update the user's pic field with the Cloudinary URL
      savedUser.pic = userPic;
      await savedUser.save();

      return res.status(200).send({ status: '200', data: savedUser });
  } catch (error) {
      return res.status(400).send({ status: '400', error: error.message });
  }
});

router.post('/login',async(req,res)=>{
try {
  const {email,password}=req.body;
    const userFind=await User.findOne({email});
    if (!userFind) {
      return res.status(401).send({ status: '401', err: "User Not Found" });
  }
  const comparePass=await bcrypt.compare(password,userFind.password);
  if (!comparePass) {
    return res.status(401).send({ status: '401', err: "Incorrect Password" });
}
delete userFind.password;
const token=jwt.sign({_id:userFind.id},"Zeeshi");
return res.status(200).send({status:200,user:userFind,token:token});

} catch (error) {
  return res.status(400).send({status:400,error:error});
  
}


})

module.exports=router