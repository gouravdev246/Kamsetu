const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload base64 images directly
// This is useful because our frontend captures snapshots as data URLs
const uploadBase64 = async (base64String) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64String, {
      folder: "kamsetu_reports",
      resource_type: "image",
    });
    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Multer storage for traditional file uploads (if needed)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "kamsetu_reports",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  upload,
  uploadBase64,
};