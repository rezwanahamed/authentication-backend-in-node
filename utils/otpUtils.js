const Otp = require('../models/Otp');
const { sendSimpleEmail } = require('../config/emailService');

const generateOtp = async (credential, credentialType) => {
    console.log('Otp function hit');
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
    console.log('otp fom util function: ', otp);
    return otp;
};

const verifyOtp = async (email, otp) => {
    try {
        const otpRecord = await Otp.findOne({
            credential: email,
            credentialType: 'email',
            otp: otp,
        });

        if (!otpRecord) {
            return false;
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await Otp.deleteOne({ _id: otpRecord._id });
            return false;
        }

        // OTP is valid, delete it from the database
        await Otp.deleteOne({ _id: otpRecord._id });
        return true;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return false;
    }
};

module.exports = { generateOtp, verifyOtp };
