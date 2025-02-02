exports.otpEmailTemplate = (otp) => {
    return `<!DOCTYPE html>
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
                    <p style="font-weight: 500; color: #3d3d3d; font-size: 16px; margin: 10px 0;">Best regards,<br>Red arc lab.</p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
