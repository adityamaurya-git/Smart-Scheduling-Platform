const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true,
})

module.exports = mongoose.model("admin" , adminSchema);