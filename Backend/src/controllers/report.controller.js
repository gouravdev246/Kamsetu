const Report = require("../models/report.model");
const { uploadBase64 } = require("../services/cloudinary.service");

const createReport = async (req, res) => {
    try {
        const { fullName, phone, pinCode, municipality, address, location, capturedImage, lat, lng } = req.body;

        // Note: 'user' is required in model, but if we don't have auth middleware yet, 
        // we might need to handle it. For now, we'll try to find user by phone or create a dummy reference.
        // If your app has auth, use req.user.id. 

        // Let's assume we want to create a report even if user isn't logged in for now, 
        // but since model says required: true, we'll need to mock it or fix the model.
        // For this task, I'll assume we pass a user ID or I'll handle Cloudinary first.

        let mediaUrl = "";
        if (capturedImage) {
            const uploadRes = await uploadBase64(capturedImage);
            mediaUrl = uploadRes.secure_url;
        }

        const newReport = await Report.create({
            user: "60d0fe4f5311236168a109ca", // Replace with req.user._id if using auth
            title: `Issue at ${municipality || pinCode}`,
            description: address || "No description provided",
            category: "Other", // You should probably add a category selector to UI
            municipality: municipality || "Unknown",
            media: mediaUrl ? [mediaUrl] : [],
            location: {
                address: location || address,
                latitude: lat || 0,
                longitude: lng || 0,
            },
            status: "Pending"
        });

        return res.status(201).json({
            message: "Report submitted successfully!",
            report: newReport,
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Resolved', 'In Progress'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        return res.status(200).json({
            message: "Report status updated successfully",
            report: updatedReport,
        });
    } catch (error) {
        console.log("Status Update Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createReport, updateReportStatus };