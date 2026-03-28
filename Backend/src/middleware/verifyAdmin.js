const jwt = require('jsonwebtoken');
const Admin = require("../models/admin.model");

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided, access denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }

        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error("Admin Auth Middleware Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyAdmin;
