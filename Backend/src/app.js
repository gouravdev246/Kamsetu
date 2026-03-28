require("dotenv").config();
const express = require("express")
const cookieParser = require("cookie-parser")

const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" })); // Required for large base64 image strings
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const authRouter = require('./routes/auth.route');
const reportRouter = require('./routes/report.router');
const contactRouter = require('./routes/contact.route');

app.use('/api/auth' , authRouter);
app.use('/api/report', reportRouter);
app.use('/api/contact', contactRouter);

app.get('/', (req, res) => {
    res.send("Hellooooouuuuuuu")
})

module.exports = app