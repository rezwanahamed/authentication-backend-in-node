const User = require('../models/User');
const Token = require('../models/Token');
const {
    generateTokens,
    verifyToken,
    blacklistToken,
} = require('../utils/tokenUtils');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const checkUserAlreadyExist = await User.findOne({
            username: username,
            email: email,
        });
        if (checkUserAlreadyExist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ username, email, password });
        const { accessToken, refreshToken } = await generateTokens(user._id);
        res.status(201).json({
            user: { id: user._id, username, email },
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
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = await generateTokens(user._id);
        res.json({
            user: { id: user._id, username: user.username, email },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
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
