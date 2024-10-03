const express = require('express');
const authController = require('../controllers/authController');
const emailController = require('../controllers/testEmailController')
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post(
    '/register-otp-verification',
    authController.registerOtpVerification
);
router.post('/logout', auth, authController.logout);
router.post('/send-email', emailController.testEmailSender)

module.exports = router;
