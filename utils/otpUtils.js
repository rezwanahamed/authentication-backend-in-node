const Otp = require('../models/Otp');

const generateOtp = async (credential, credentialType) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date();
    const expiresAt = new Date(currentTime.getTime() + 5 * 60 * 1000);

    // Check if an OTP with the same credential and type already exists
    const existingOtp = await Otp.findOne({
        credential: credential,
    });

    if (existingOtp) {
        await existingOtp.delete();
    }

    await Otp.create({
        otp: otp,
        credential: credential,
        credentialType: credentialType,
        expiresAt: expiresAt,
    });
    return otp;
};

const verifyOtp = async (otp, credential) => {
    const currentTime = new Date();
    const otpObj = Otp.findOne({ otp: otp, credential: credential });

    if (!otpObj) {
        throw new Error('Invalid OTP');
    }

    if (currentTime > otpObj.expiresAt) {
        throw new Error('OTP expired');
    }

    await otpObj.delete(); // Delete the OTP once it's been verified
    return true;
};

module.exports = { generateOtp, verifyOtp };
