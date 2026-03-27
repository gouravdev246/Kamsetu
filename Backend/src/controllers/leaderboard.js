const Report = require("../models/report.model");
const Admin = require("../models/admin.model");
const User = require("../models/user.model");

const getMunicipalityStats = async (req, res) => {
    try {
        const stats = await Report.aggregate([
            {
                $group: {
                    _id: "$municipality",
                    totalReports: { $sum: 1 },
                    resolvedReports: {
                        $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    municipality: "$_id",
                    total: "$totalReports",
                    resolved: "$resolvedReports",
                    resolutionRate: {
                        $cond: [
                            { $eq: ["$totalReports", 0] },
                            0,
                            { $divide: ["$resolvedReports", "$totalReports"] }
                        ]
                    }
                }
            },
            { $sort: { resolutionRate: -1, total: -1 } }
        ]);

        return res.status(200).json({ stats });
    } catch (error) {
        console.error("Municipality Stats Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTopContributors = async (req, res) => {
    try {
        const contributors = await Report.aggregate([
            {
                $group: {
                    _id: "$user",
                    reportCount: { $sum: 1 }
                }
            },
            { $sort: { reportCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users", // Assumes the collection name for User model is 'users'
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    reportCount: 1,
                    points: { $multiply: ["$reportCount", 10] } // Mock points logic
                }
            }
        ]);

        return res.status(200).json({ contributors });
    } catch (error) {
        console.error("Top Contributors Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getMunicipalityStats, getTopContributors };
