const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    organisation:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
        unique: true,
    },
    address:{
        type: String,
        required: true,
    },
    
});

module.exports = mongoose.model("Admin", adminSchema);