const Report = require("../models/report.model");
const { uploadBase64 } = require("../services/cloudinary.service");
const { analyzeReport, generateStatusUpdate } = require("../services/aiPriorityEngine");

const createReport = async (req, res) => {
    try {
        const { 
            fullName, phone, pinCode, municipality, address, 
            location, capturedImage, lat, lng, category = "Other" 
        } = req.body;

        let mediaUrl = "";
        if (capturedImage) {
            const uploadRes = await uploadBase64(capturedImage);
            mediaUrl = uploadRes.secure_url;
        }

        const title = `${category} at ${municipality || pinCode}`;
        const description = address || "Citizen report submitted via Kamsetu.";

        // AI Analysis
        const { priority, recommendation } = analyzeReport(title, description, category);

        const newReport = await Report.create({
            user: "60d0fe4f5311236168a109ca", // Replace with req.user._id if using auth
            title,
            description,
            category,
            municipality: municipality || "Unknown",
            pinCode: pinCode || "000000",
            media: mediaUrl ? [mediaUrl] : [],
            location: {
                address: location || address,
                latitude: lat || 0,
                longitude: lng || 0,
            },
            status: "Pending",
            priority,
            aiRecommendation: recommendation
        });

        return res.status(201).json({
            message: "Report submitted successfully!",
            report: newReport,
        });
    } catch (error) {
        console.log("Report Creation Error:", error);
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

        // Fetch current report to get context for AI update
        const currentReport = await Report.findById(id);
        if (!currentReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Generate AI Public Update Message
        const aiPublicMessage = generateStatusUpdate(status, currentReport.category, currentReport.municipality);

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { 
                status,
                publicUpdate: aiPublicMessage 
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Report status updated and citizen notified via AI.",
            report: updatedReport,
        });
    } catch (error) {
        console.log("Status Update Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const toggleUpvote = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required to upvote." });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const hasUpvoted = report.upvotes.includes(userId);

        if (hasUpvoted) {
            // Remove upvote
            report.upvotes = report.upvotes.filter(uid => uid.toString() !== userId.toString());
        } else {
            // Add upvote
            report.upvotes.push(userId);
        }

        await report.save();

        return res.status(200).json({
            message: hasUpvoted ? "Upvote removed" : "Upvote added",
            upvotesCount: report.upvotes.length,
            hasUpvoted: !hasUpvoted,
            report
        });

    } catch (error) {
        console.log("Upvote Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createReport, updateReportStatus, toggleUpvote };