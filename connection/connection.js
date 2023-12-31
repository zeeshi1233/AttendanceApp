const mongoose=require('mongoose');
const con=mongoose.connect('mongodb+srv://zeeshi:zeeshi@zeeshan.n2n8lxw.mongodb.net/attendance?retryWrites=true&w=majority').then(()=>{
    console.log("Connection Successfully");
})
.catch((err)=>{
    console.log("Connection failed",err.message);
})
