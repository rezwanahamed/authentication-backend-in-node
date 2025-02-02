const User = require('../models/User');
const Token = require('../models/Token');
const { sendSimpleEmail } = require('../config/emailService');
const {
    generateTokens,
    verifyToken,
    blacklistToken,
} = require('../utils/tokenUtils');
const { generateOtp, verifyOtp } = require('../utils/otpUtils');
const {
    verifyPasskey,
    saveGeneratedPasskey,
    getGeneratedPasskeys,
} = require('../utils/passKeyultis');
const {
    getWelcomeEmailTemplate,
} = require('../templates/welcomeEmailTemplate');
const { otpEmailTemplate } = require('../templates/otpEmailTemplate');

exports.register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            address,
            age,
            dateOfBirth,
            email,
            password,
        } = req.body;

        const checkUserAlreadyExist = await User.findOne({
            email: email,
        });
        if (checkUserAlreadyExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const checkPhoneNumberIsUnique = await User.findOne({
            phone: phone,
        });
        if (checkPhoneNumberIsUnique) {
            return res
                .status(401)
                .json({ message: 'Phone number already exist' });
        }

        const user = await User.create({
            firstName,
            lastName,
            phone,
            address,
            age,
            dateOfBirth,
            email,
            password,
        });
        const otp = await generateOtp(user.email, 'email');
        const getOtpEmailTemplate = otpEmailTemplate(otp);
        sendSimpleEmail(user.email, 'Login OTP ', getOtpEmailTemplate);
        res.status(201).json({
            message: 'otp generated',
        });
    } catch (error) {
        next(error);
    }
};

// generate new otp
exports.generateNewOtp = async (req, res) => {
    try {
        const otp = await generateOtp(req.body.email, 'email');
        const getOtpEmailTemplate = otpEmailTemplate(otp);
        sendSimpleEmail(req.body.email, 'Login OTP ', getOtpEmailTemplate);
        res.status(201).json({
            message: 'otp generated',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to generate otp',
            error,
        });
    }
};

exports.registerOtpVerification = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const verified = await verifyOtp(email, otp);
        if (!verified) {
            return res.status(401).json({ message: 'Invalid otp' });
        }

        user.verified = true;
        await user.save();

        const { accessToken, refreshToken } = await generateTokens(user._id);
        await saveGeneratedPasskey(email);
        const userAllPasskeys = await getGeneratedPasskeys(email);

        if (!userAllPasskeys || !Array.isArray(userAllPasskeys)) {
            throw new Error('Failed to generate passkeys');
        }

        // Generate passkey HTML list
        const passkeysHtml = userAllPasskeys
            .map(
                (pk) =>
                    `<div style="font-size: 18px; letter-spacing: 1px; color: #2c3e50; font-weight: bold; margin: 5px 0; text-align: center;">${pk.passkey}</div>`
            )
            .join('');

        const emailTemplate = getWelcomeEmailTemplate(passkeysHtml);
        await sendSimpleEmail(
            email,
            'Congratulations for creating your account',
            emailTemplate
        );

        return res.status(200).json({
            user: { id: user._id, email: user.email },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'User already exists' });
        }

        const isUserVerified = await user.verified;
        if (!isUserVerified) {
            return res.status(403).json({ message: 'User is not verified' });
        }

        return res.status(200).json({ message: 'Otp generated' });
    } catch (error) {
        next(error);
    }
};

exports.generateLoginOtp = async (req, res, next) => {
    try {
        const { credential, credentialType } = req.body;

        if (credentialType === 'email') {
            try {
                const otp = await generateOtp(credential, 'email');
                const getOtpEmailTemplate = otpEmailTemplate(otp);
                await sendSimpleEmail(
                    credential,
                    'Login OTP ',
                    getOtpEmailTemplate
                );
                res.status(200).json({
                    message: 'otp generated',
                });
            } catch (error) {
                res.status(500).json({
                    message: 'Failed to generate otp',
                    error,
                });
            }
        } else if (credentialType === 'phone') {
            generateSmsLoginOtp(credential, credential);
        } else {
            return res.status(400).json({ message: 'Invalid credential type' });
        }
    } catch (e) {
        next(e);
    }
};

exports.verifyLoginOtp = async (req, res, next) => {
    try {
        const { otp, email } = req.body;

        const isOtpVerified = await verifyOtp(email, otp);
        if (!isOtpVerified) {
            return res.status(400).json({ message: 'Invalid credential type' });
        }

        const user = await User.findOne({ email: email });
        const { accessToken, refreshToken } = await generateTokens(user._id);
        return res.status(200).json({
            user: { id: user._id, email: user.email },
            accessToken,
            refreshToken,
            message: 'Login successful',
        });
    } catch (e) {
        next(e);
    }
};

exports.verifyLoginViaPassCode = async (req, res, next) => {
    try {
        const { passkey, email } = req.body;
        const isPasskeyValid = await verifyPasskey(email, passkey);
        if (!isPasskeyValid) {
            return res.status(400).json({ message: 'Invalid credential type' });
        }

        const user = await User.findOne({ email: email });
        const { accessToken, refreshToken } = await generateTokens(user._id);
        return res.status(200).json({
            user: { id: user._id, email: user.email },
            accessToken,
            refreshToken,
            message: 'Login successful',
        });
    } catch (e) {
        next(e);
    }
};

exports.refreshToken = async (req, res, next) => {
    // console.log('Refresh token api called ');
    try {
        const { refreshToken } = req.body;
        const decoded = verifyToken(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        // console.log('token decode pass1 ');
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const token = await Token.findOne({
            token: refreshToken,
            type: 'refresh',
        });
        // console.log('token found pass2');
        if (!token) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }
        const user = token.userId;
        // console.log('user id: ', user);
        // console.log('user found pass3');

        await Token.deleteOne({ _id: token._id });
        // console.log('token deleted pass 4');
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateTokens(user);
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
        // console.log('all test code passed successfully 😊💡❤️');
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken, accessToken } = req.body;
        const userId = req.user?.userId;

        await Token.deleteOne({ token: refreshToken, type: 'refresh' });
        await blacklistToken(accessToken, userId);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};
