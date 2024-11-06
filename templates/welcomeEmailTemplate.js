// Separate function for email template
exports.getWelcomeEmailTemplate = (passkeysHtml) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
</head>
<body style="font-family: 'Courier New', monospace; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: white !important;">
    <img src="https://res.cloudinary.com/dt3ve96sk/image/upload/v1699633221/Startup-New-Product-Launch-1--Streamline-New-York_isy70h.png" 
         alt="Security Header" 
         style="width: 100%; max-width: 400px; margin: 20px auto; display: block;">

    <div style="margin: 20px 0;">
        <h2 style="color: rgb(61, 61, 61); font-size:18px">Welcome to Our Platform! 🎉</h2>
        <p style="font-weight: 500; font-size:14px; color: rgb(61, 61, 61);">Hello,</p>
        <p style="font-weight: 500; font-size:14px; color: rgb(61, 61, 61);">Thank you for joining us. Your account has been successfully created. Below are your security passkeys for account recovery and API access.</p>
    </div>

    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
        <p style="font-weight: 500; font-size:14px; color: rgb(61, 61, 61);">Your Security Passkeys:</p>
        ${passkeysHtml}
        <p style="font-weight: 500; font-size:14px; color: rgb(61, 61, 61);">Store these keys in a secure location</p>
    </div>

    <div style="margin: 20px 0;">
        <h3 style="color: rgb(61, 61, 61); font-size:18px">How to Use Your Passkeys:</h3>
        <ol style="padding-left: 20px;">
            <li style="font-weight: 500; font-size:14px; margin-bottom: 4px;">Store these passkeys in a secure password manager</li>
            <li style="font-weight: 500; font-size:14px;margin-bottom: 4px;">Use them when requested during account recovery</li>
            <li style="font-weight: 500; font-size:14px;margin-bottom: 4px;">For API access, use one key per application</li>
            <li style="font-weight: 500; font-size:14px;margin-bottom: 4px;">Rotate keys regularly for enhanced security</li>
        </ol>
    </div>

    <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-top: 20px;border-radius: 5px;">
        <h3 style="color: rgb(61, 61, 61); font-size:18px">⚠️ Important Security Notice:</h3>
        <ul style="padding-left: 20px;">
            <li style="font-weight: 500; font-size:14px; margin-bottom: 4px;">Keep these passkeys confidential and secure</li>
            <li style="font-weight: 500; font-size:14px; margin-bottom: 4px;">Never share your passkeys with anyone</li>
            <li style="font-weight: 500; font-size:14px; margin-bottom: 4px;">Our staff will never ask for your passkeys</li>
            <li style="font-weight: 500; font-size:14px; margin-bottom: 4px;">Each key can only be used once for recovery purposes</li>
            <li style="font-weight: 500; font-size:14px; margin-bottom: 4px;">If you suspect any key has been compromised, deactivate it immediately</li>
        </ul>
    </div>

    <div style="margin: 20px 0;">
        <h3 style="color: rgb(61, 61, 61); font-size:18px">Next Steps:</h3>
        <ol style="padding-left: 20px;">
            <li style="font-weight: 500; font-size:14px">Complete your profile setup</li>
            <li style="font-weight: 500; font-size:14px">Enable two-factor authentication (2FA)</li>
            <li style="font-weight: 500; font-size:14px">Review our security best practices</li>
        </ol>
    </div>

    <div style="margin: 20px 0;">
        <p style="font-weight: 500; font-size:14px; color: rgb(61, 61, 61);">Need help? Our support team is available 24/7.</p>
        <p style="font-weight: 500; font-size:14px; color: rgb(61, 61, 61);">Best regards,<br>Your Security Team</p>
    </div>
</body>
</html>`;
};