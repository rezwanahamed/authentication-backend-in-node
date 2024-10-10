const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema(
    {
        otp: {
            type: Number,
            required: true,
          },
        credentialType: {
            type: String,
            enum: ['phone', 'email'],
            required: true,
        },
        credential: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: '5m' },
        },
    },
    {
        timestamps: true,
    }
);

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
