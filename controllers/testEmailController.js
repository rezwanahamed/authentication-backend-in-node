const { sendSimpleEmail } = require('../config/emailService');

const otpEmail = async (req, res) => {
    const getOtp = 
    sendSimpleEmail(
        'redarclab@gmail.com',
        'Test Subject',
        '<p>Hello, World!</p>'
    );
};

module.exports = { otpEmail };
