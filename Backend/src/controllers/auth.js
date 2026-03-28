const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const OTP = require('../models/otp.model');
const Admin = require('../models/admin.model');



// ADMIN AUTH CONTROLLERS

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate 4-digit random OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Save OTP to database (overwrite if exists)
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        console.log(`[OTP DEBUG] OTP for ${email}: ${otp}`);

        // In a real app, send actual email here
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        console.log("Error", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

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

const User = require('../models/user.model');

// CITIZEN/USER AUTH CONTROLLERS

const registerUser = async (req, res) => {
    try {
        const { name, phone, password, address, municipality, pinCode } = req.body;
        
        if (!municipality || !pinCode) {
            return res.status(400).json({ message: "Municipality and PIN code are required" });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Mobile number already registered" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            name,
            phone,
            password: hashedPassword,
            address,
            municipality,
            pinCode
        });
        
        const token = jwt.sign({
            id: newUser._id,
            role: 'user'
        }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            partitioned: true
        });
        
        newUser.password = undefined; 
        return res.status(201).json({
            message: "Citizen registered successfully on Kamsetu",
            user: newUser
        });
    } catch (err) {
        console.log("User Register Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        if (!phone || !password) {
            return res.status(400).json({ message: "Mobile number and password are required" });
        }
        
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({
            id: user._id,
            role: 'user'
        }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            partitioned: true
        });

        user.password = undefined;
        res.status(200).json({
            message: "Logged in successfully",
            user: user
        });
    } catch (err) {
        console.log("User Login Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { 
    registerAdmin,
    loginAdmin,
    registerUser,
    loginUser
};