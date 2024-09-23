const { verifyToken } = require('../utils/tokenUtils');
const Token = require('../models/Token');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const blacklistedToken = await Token.findOne({ token, type: 'blacklisted' });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has been blacklisted' });
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

module.exports = auth;