require("dotenv").config();
const express = require("express")
const cookieParser = require("cookie-parser")

const cors = require("cors");

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" })); // Required for large base64 image strings
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const authRouter = require('./routes/auth.route');
const reportRouter = require('./routes/report.router');

app.use('/api/auth' , authRouter);
app.use('/api/report', reportRouter);

app.get('/', (req, res) => {
    res.send("Hellooooouuuuuuu")
})

module.exports = app