
const express = require('express')
const router = express.Router()

const { registerAdmin, loginAdmin } = require('../controllers/auth')
const { sendOTP } = require('../controllers/otp')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/send-otp', sendOTP)

module.exports = router 