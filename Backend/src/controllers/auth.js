const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const OTP = require('../models/otp.model');
const Admin = require('../models/admin.model');



// ADMIN AUTH CONTROLLERS

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, phone, address, organisation, pincode } = req.body;
        
        // Check if admin with same email or phone exists
        const existingAdmin = await Admin.findOne({ 
            $or: [{ email }, { phone }] 
        });
        
        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists with this email or phone"
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAdmin = await Admin.create({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            organisation,
            pincode
        });
        
        const token = jwt.sign({
            id: newAdmin._id,
            email: newAdmin.email,
            role: 'admin' 
        }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            partitioned: true
        });
        
        newAdmin.password = undefined; 
        return res.status(201).json({
            message: "Admin registered successfully",
            admin: newAdmin
        });
    } catch (err) {
        console.log("Error", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const loginAdmin = async (req, res) => {
    try {
        // Can login using email, password, and otp
        const { email, password, otp } = req.body;
        
        if (!email || !password || !otp) {
            return res.status(400).json({ message: "Email, password, and OTP are required" });
        }
        
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Verify OTP
        const validOtp = await OTP.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        const token = jwt.sign({
            id: admin._id,
            email: admin.email,
            role: 'admin'
        }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            partitioned: true
        });


        

        admin.password = undefined;
        res.status(200).json({
            message: "Admin logged in successfully",
            admin: admin
        });
    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { 
    registerAdmin,
    loginAdmin
};