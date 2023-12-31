const express=require("express");
const app=express();
const db=require("./connection/connection.js");
const tastroute=require('./route/index.js');
const cors=require('cors');

app.use(cors());
app.use('/api',tastroute);
app.use(express.json());

const PORT=3000;

app.listen(PORT,()=>{
    console.log("Connection Made");
})