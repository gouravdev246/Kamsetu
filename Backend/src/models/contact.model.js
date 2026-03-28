const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Police", "Hospital", "Municipality", "Fire Station", "Emergency"],
    },
    phone: {
        type: String,
        required: true,
    },
    municipality: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    pinCode: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
