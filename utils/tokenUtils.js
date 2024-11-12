const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const generateTokens = async (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });

    await Token.create({
        userId,
        token: refreshToken,
        type: 'refresh',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { accessToken, refreshToken };
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

const blacklistToken = async (token, id) => {
    await Token.create({
        userId: id,
        token,
        type: 'blacklisted',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
};

module.exports = { generateTokens, verifyToken, blacklistToken };
