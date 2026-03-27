const Report = require("../models/report.model");


const allReport = async (req, res) => {
    try {
        const reports = await Report.find();
        return res.status(200).json({
            message: "Reports fetched successfully",
            reports,
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const currentReport = await Report.findById(id);
        
        if (!currentReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        
        return res.status(200).json({
            message: "Report fetched successfully",
            report: currentReport,
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { allReport, getReportById };
