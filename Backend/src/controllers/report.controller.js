const report = require("../models/report.model");






const createReport = async (req, res) => {
    try {
        const{ title, description, category, location } = req.body;
        
        if(!title || !description || !category || !location){
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        const newReport = await report.create({
            title,
            description,
            category,
            location,
        });
        return res.status(201).json({
            message: "Report created successfully",
            report: newReport,
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = createReport