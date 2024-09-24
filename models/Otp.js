const otpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
        expiryTime: {
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
