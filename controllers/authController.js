const User = require('../models/User');
const Token = require('../models/Token');
const {
    generateTokens,
    verifyToken,
    blacklistToken,
} = require('../utils/tokenUtils');
const { generateOtp, verifyOtp } = require('../utils/otpUtils');
const { verifyPasskey } = require('../utils/passKeyultis');

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

        await generateOtp(user.email, "email");
        res.status(201).json({
            message: 'otp generated',
        });
    } catch (error) {
        next(error);
    }
};

exports.registerOtpVerification = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const verified = verifyOtp(email, otp);

        if (!verified) {
            return res.status(401).json({ message: 'Invalid otp' });
        }

        user.verified = true;
        await user.save();

        const { accessToken, refreshToken } = await generateTokens(user._id);
        res.json({
            user: { id: user._id, email: user.email },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (
            !user ||
            !(await user.comparePassword(password)) ||
            user.verified != true
        ) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isUserVerified = await User.verified;
        if (!isUserVerified) {
            return res.status(403).json({ message: 'User is not verified' });
        }
    } catch (error) {
        next(error);
    }
};

exports.generateLoginOtp = async (req, res, next) => {
    try {
        const { credential, credentialType } = req.body;
        if (credentialType === 'email') {
            generateEmailLoginOtp(credential);
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
        const { otp, credential, email } = req.body;
        const isOtpVerified = await verifyOtp(otp, credential);
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
        const { passKey, email } = req.body;
        const isPasskeyValid = await verifyPasskey(email, passKey);
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
    try {
        const { refreshToken } = req.body;
        const decoded = verifyToken(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const token = await Token.findOne({
            userId: decoded.userId,
            token: refreshToken,
            type: 'refresh',
        });
        if (!token) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }
        await Token.deleteOne({ _id: token._id });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateTokens(decoded.userId);
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        await Token.deleteOne({ token: refreshToken, type: 'refresh' });
        await blacklistToken(req.headers.authorization.split(' ')[1]);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};
