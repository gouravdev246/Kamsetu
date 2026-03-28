
const express = require('express')
const router = express.Router()

const { registerAdmin, loginAdmin, registerUser, loginUser } = require('../controllers/auth')
const { sendOTP } = require('../controllers/otp')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/citizen/register', registerUser)
router.post('/citizen/login', loginUser)
router.post('/send-otp', sendOTP)

module.exports = router 