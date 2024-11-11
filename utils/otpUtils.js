const Otp = require('../models/Otp');

const generateOtp = async (credential, credentialType) => {
    try {
        // Input validation
        if (!credential) {
            throw new Error('Credential is required');
        }
        if (!credentialType) {
            throw new Error('Credential type is required');
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Set expiration time (5 minutes from now)
        const currentTime = new Date();
        const expiresAt = new Date(currentTime.getTime() + 1 * 60 * 1000);

        // Delete any existing OTPs for this credential
        await Otp.deleteMany({ credential });

        // Create new OTP record
        const otpRecord = await Otp.create({
            otp,
            credential,
            credentialType,
            expiresAt,
            createdAt: currentTime,
        });

        if (!otpRecord) {
            throw new Error('Failed to create OTP record');
        }

        console.log(`OTP generated for ${credentialType}: ${credential}`);
        return otp;
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw error;
    }
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
