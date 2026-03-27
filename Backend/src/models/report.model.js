const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        // Who reported it
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        // Basic Info
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Pothole", "Garbage", "Drainage", "Water Leakage", "Broken Road", "Other"],
        },
        municipality: {
            type: String,
            required: true,
            index: true,
        },
        
        // Media (Images or Videos of the issue)
        media: [{
            type: String, // Cloudinary URLs
        }],

        // Spatial/Location
        location: {
            address: { type: String }, 
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },

        // Management Data
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved"],
            default: "Pending",
        },
    },
    { timestamps: true }
);


reportSchema.index({ "location.latitude": 1, "location.longitude": 1 });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
