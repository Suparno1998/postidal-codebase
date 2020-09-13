const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    country:{
        type:String
    },
    gender:{
        type:String
    },
    phone:{
        type:String
    },
    addresses:{
        type : Object
    },
    verified:{
        type:Number,
        default:0
    },
    token:{
        type:String
    },
    department:{
        type:String
    }
   
});

module.exports = mongoose.model('users',UserSchema);