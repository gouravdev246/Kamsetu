const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    
})

const Application = mongoose.model("Application", applicationSchema)

