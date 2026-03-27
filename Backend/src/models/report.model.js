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
        
        // Media (Images or Videos of the issue)
        media: [{
            type: String, // Cloudinary URLs
        }],

        // Spatial/Location
        location: {
            address: { type: String },
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

// Optional: Geospatial indexing for location-based queries in the future
reportSchema.index({ "location.latitude": 1, "location.longitude": 1 });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
