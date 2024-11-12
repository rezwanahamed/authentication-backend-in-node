const Passkey = require('../models/PassKey');
const User = require('../models/User');
const { getGeneratedPasskeys } = require('../utils/passKeyultis');

exports.userData = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId?.userId).select("email firstName lastName age dateOfBirth address")

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.userPassKeys = async (req, res) => {
    try {
        // Extract userId from request, use optional chaining to handle possible undefined
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized - User ID not provided' });
        }

        // Retrieve user data based on userId
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Fetch passkeys associated with the user's email
        const userPasskeys = await getGeneratedPasskeys(user?.email)

        // Return structured response with user and their passkeys (empty array if none found)
        res.status(200).json({
            user,
            passkeys: userPasskeys || [] // Default to empty array if no passkeys found
        });

    } catch (error) {
        console.error('Error retrieving user data:', error);
        
        // Specific handling for invalid user ID format
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        // Generic error handling, expose error message only in development
        res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
