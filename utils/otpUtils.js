const Otp = require('../models/Otp');

const verifyOtp = async (otp, credential) => {
    const currentTime = new Date();
    const otpObj = Otp.findOne({ otp: otp, credential: credential });

    if (!otpObj) {
        throw new Error('Invalid OTP');
    }

    if (currentTime > otpObj.expiresAt) {
        throw new Error('OTP expired');
    }

    return true;
};

const blacklistOtp = async (otp, credential) => {
    try {
        const result = await Otp.findOneAndDelete({
            otp: otp,
            credential: credential,
        });
        return !!result; // Returns true if an OTP was found and deleted, false otherwise
    } catch (error) {
        throw new Error('Failed to blacklist OTP');
    }
};



module.exports = { verifyOtp, blacklistOtp };
