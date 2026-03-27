const nodemailer = require("nodemailer");
const OTP = require("../models/otp.model");

// Configure the SMTP Transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // You can change this to another service like Outlook/Mailtrap
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate 4-digit random OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Update or Create OTP record in DB
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Define Email Options with a modern template
        const mailOptions = {
            from: `"Kamsetu Auth" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Kamsetu Admin Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #6200EE; text-align: center;">Kamsetu Municipal Portal</h2>
                    <p style="font-size: 16px;">Hello,</p>
                    <p style="font-size: 16px;">Use the following 4-digit verification code to access your admin account. This code is valid for 5 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; tracking-widest: 5px;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #666;">If you did not request this code, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
                    <p style="font-size: 12px; text-align: center; color: #999;">&copy; 2026 Kamsetu Civic Issue Tracker</p>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        
        console.log(`[OTP SENT] ${email} -> ${otp}`);
        
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    } catch (err) {
        console.error("OTP Sending Error:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

module.exports = { sendOTP };
