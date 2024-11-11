const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { saveGeneratedPasskey } = require('../utils/passKeyultis');

const router = express.Router();

router.post('/register', authController.register);
router.post('/generate-new-register-opt', authController.generateNewOtp);
router.post(
    '/register-otp-verification',
    authController.registerOtpVerification
);
router.post('/login', authController.login);
router.post('/generate-login-otp', authController.generateLoginOtp)
router.post('/login-via-passkey', authController.verifyLoginViaPassCode)
router.post('/login-otp-verification', authController.verifyLoginOtp);
router.post('/generate-passkey', saveGeneratedPasskey )
router.post('/logout', auth, authController.logout);
router.post('/refresh-token', authController.refreshToken);
module.exports = router;
