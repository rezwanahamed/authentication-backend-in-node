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
        sendSimpleEmail(
            user.email,
            'Login OTP ',
            `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Courier New, Courier, monospace; line-height: 1.6; margin: 0; padding: 20px; color: #333333; background-color: #ffffff !important;">
    <table cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td align="left">
                <img src="https://res.cloudinary.com/dt3ve96sk/image/upload/v1730619983/Protect-Privacy--Streamline-New-York_pgaitc.png" 
                     alt="Security Header" 
                     style="width: 100%; max-width: 400px; margin: 20px auto; display: block;">
                
                <div style="margin: 20px 0;">
                    <h2 style="color: #3d3d3d; font-size: 24px; margin-bottom: 15px;">Your One-Time Password (OTP)</h2>
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 10px 0;">Hello ${firstName},</p>
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 10px 0;">You have requested a one-time password for account verification. Please use the code below to complete your authentication.</p>
                </div>

                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 10px 0;">Your OTP Code:</p>
                    <div style="font-size: 32px; letter-spacing: 1px; color: #2c3e50; font-weight: bold; margin: 15px 0;">${otp}</div>
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 10px 0;">This code will expire in 5 minutes</p>
                </div>

                <div style="margin: 20px 0;">
                    <h3 style="color: #3d3d3d; font-size: 20px; margin-bottom: 15px;">How to Use Your OTP:</h3>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 5px 0;">Return to the verification page</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 5px 0;">Enter the 6-digit code shown above</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 5px 0;">Click on "Verify" or "Submit" to complete the process</li>
                    </ol>
                </div>

                <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-top: 20px;">
                    <h3 style="color: #3d3d3d; font-size: 20px; margin: 0 0 10px 0;">⚠️ Important Security Notice:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 5px 0;">This OTP is valid for one-time use only</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 5px 0;">Never share this OTP with anyone</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 5px 0;">Our staff will never ask for your OTP</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 5px 0;">If you didn't request this OTP, please ignore this email and contact support</li>
                    </ul>
                </div>

                <div style="margin: 20px 0;">
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 10px 0;">Best regards,<br>Your Security Team</p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`
        );
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
        sendSimpleEmail(
            req.body.email,
            'Login OTP ',
            `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Courier New, Courier, monospace; line-height: 1.6; margin: 0; padding: 20px; color: #333333; background-color: #ffffff !important;">
    <table cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td align="left">
                <img src="https://res.cloudinary.com/dt3ve96sk/image/upload/v1730619983/Protect-Privacy--Streamline-New-York_pgaitc.png" 
                     alt="Security Header" 
                     style="width: 100%; max-width: 400px; margin: 20px auto; display: block;">
                
                <div style="margin: 20px 0;">
                    <h2 style="color: #3d3d3d; font-size: 18px; margin-bottom: 15px;">Your One-Time Password (OTP)</h2>
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">Hello,</p>
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">You have requested a one-time password for account verification. Please use the code below to complete your authentication.</p>
                </div>

                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">Your OTP Code:</p>
                    <div style="font-size: 32px; letter-spacing: 1px; color: #2c3e50; font-weight: bold; margin: 15px 0;">${otp}</div>
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">This code will expire in 5 minutes</p>
                </div>

                <div style="margin: 20px 0;">
                    <h3 style="color: #3d3d3d; font-size: 18px; margin-bottom: 15px;">How to Use Your OTP:</h3>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Return to the verification page</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Enter the 6-digit code shown above</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Click on "Verify" or "Submit" to complete the process</li>
                    </ol>
                </div>

                <div style="background-color: #fff3cd; padding: 25px; border-left: 4px solid #ffc107; margin-top: 20px;border-radius: 5px;">
                    <h3 style="color: #3d3d3d; font-size: 18px; margin: 0 0 10px 0;">⚠️ Important Security Notice:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">This OTP is valid for one-time use only</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Never share this OTP with anyone</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Our staff will never ask for your OTP</li>
                        <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">If you didn't request this OTP, please ignore this email and contact support</li>
                    </ul>
                </div>

                <div style="margin: 20px 0;">
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">Best regards,<br>Your Security Team</p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`
        );
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

                await sendSimpleEmail(
                    credential,
                    'Login OTP ',
                    `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Courier New, Courier, monospace; line-height: 1.6; margin: 0; padding: 20px; color: #333333; background-color: #ffffff !important;">
            <table cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff;">
                <tr>
                    <td align="left">
                        <img src="https://res.cloudinary.com/dt3ve96sk/image/upload/v1730619983/Protect-Privacy--Streamline-New-York_pgaitc.png" 
                             alt="Security Header" 
                             style="width: 100%; max-width: 400px; margin: 20px auto; display: block;">
                        
                        <div style="margin: 20px 0;">
                            <h2 style="color: #3d3d3d; font-size: 18px; margin-bottom: 15px;">Your One-Time Password (OTP)</h2>
                            <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">Hello,</p>
                            <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">You have requested a one-time password for account verification. Please use the code below to complete your authentication.</p>
                        </div>
        
                        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                            <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">Your OTP Code:</p>
                            <div style="font-size: 32px; letter-spacing: 1px; color: #2c3e50; font-weight: bold; margin: 15px 0;">${otp}</div>
                            <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">This code will expire in 5 minutes</p>
                        </div>
        
                        <div style="margin: 20px 0;">
                            <h3 style="color: #3d3d3d; font-size: 18px; margin-bottom: 15px;">How to Use Your OTP:</h3>
                            <ol style="margin: 0; padding-left: 20px;">
                                <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Return to the verification page</li>
                                <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Enter the 6-digit code shown above</li>
                                <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Click on "Verify" or "Submit" to complete the process</li>
                            </ol>
                        </div>
        
                        <div style="background-color: #fff3cd; padding: 25px; border-left: 4px solid #ffc107; margin-top: 20px;border-radius: 5px;">
                            <h3 style="color: #3d3d3d; font-size: 18px; margin: 0 0 10px 0;">⚠️ Important Security Notice:</h3>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">This OTP is valid for one-time use only</li>
                                <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Never share this OTP with anyone</li>
                                <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">Our staff will never ask for your OTP</li>
                                <li style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 5px 0;">If you didn't request this OTP, please ignore this email and contact support</li>
                            </ul>
                        </div>
        
                        <div style="margin: 20px 0;">
                            <p style="font-weight: 500; color: #3d3d3d; font-size: 14px; margin: 10px 0;">Best regards,<br>Your Security Team</p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>`
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
