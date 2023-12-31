const mongoose=require('mongoose');
const {Schema}=mongoose;
const UserSchema=new Schema({
    name:{type:Schema.Types.String,require:true},
    pic:{type:Schema.Types.String,require:true},
    email:{type:Schema.Types.String,require:true,unique:true},
    password:{type:Schema.Types.String,require:true},
})
const UserModel=mongoose.model('user',UserSchema);
module.exports=UserModel;