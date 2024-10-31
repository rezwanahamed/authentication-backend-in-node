const { Resend } = require('resend');

const resend = new Resend('re_YkV8McjD_3WdkzsGNjGi28qCsHugQm4xb');

exports.testEmailSender = async (req, res, next) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['deadpoolzrx@gmail.com'],
            subject: 'Hello World',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your OTP Code</title>
    <style type="text/css">
        /* Web font loader for clients that support it */
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,700&display=swap');
        
        /* Fallback for email clients */
        body, table, td {
            font-family: 'Satoshi', Arial, 'Helvetica Neue', Helvetica, sans-serif;
        }
    </style>
</head>
<body style="background-color: #0a0a0a; margin: 0; padding: 0; font-family: 'Satoshi', Arial, 'Helvetica Neue', Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; padding: 24px;">
        <tr>
            <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <div style="background-color: #233856; width: 48px; height: 48px; border-radius: 8px; display: inline-block; text-align: center; line-height: 48px;">
                                <img src="https://res.cloudinary.com/de5d5jbdk/image/upload/v1728542523/shield-plus_akxtc0.svg" alt="Shield Icon" style="vertical-align: middle;" width="24" height="24" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 20px;">
                            <h1 style="color: white; font-size: 20px; font-weight: 600; margin-bottom: 0; line-height: 1;">Your OTP Code</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 4px;">
                            <p style="color: #9ca3af; font-size: 16px; font-weight: 500; margin: 0;">Use the following code to complete your login:</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 16px; padding-bottom: 30px;">
                            <p style="color: #3b82f6; font-size: 32px; font-weight: bold; margin: 0;">123456</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="color: #9ca3af; font-size: 16px; padding-bottom: 16px; font-weight: 500; margin: 0;">Use the OTP to verify your account. Please do not share the OTP with others.</p>
                        </td>
                    </tr>
                    
                     <tr>
                        <td>
                           <hr style="border: none; height: 1px; background-color: #1f2937; color: #f97316; margin: 0;" />
                        </td>
                    </tr>
                    
                    <!-- New partition starts here -->
                    
                    <tr>
                        <td style="padding-top: 20px;">
                            <div style="background-color: #233856; width: 48px; height: 48px; border-radius: 8px; display: inline-block; text-align: center; line-height: 48px;">
                                <img src="https://res.cloudinary.com/de5d5jbdk/image/upload/v1728542660/key_uqfbj3.svg" alt="Key Icon" style="vertical-align: middle;" width="24" height="24" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 20px;">
                            <h1 style="color: white; font-size: 20px; font-weight: 600; margin-bottom: 0; line-height: 1;">Your Passkeys for Login</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 4px;">
                            <p style="color: #9ca3af; font-size: 16px; font-weight: 500; margin: 0;">Use these passkeys if any login problems occur:</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="color: white; font-size: 16px; padding-top: 10px; font-weight: 500; margin: 0;">
                                7294851036<br />
                                1685309472<br />
                                9037256184<br />
                                5148723690<br />
                                3926705814<br />
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`,
        });

        if (error) {
            console.error('Email sending failed:', error);
            return res
                .status(500)
                .json({ message: 'Failed to send email', error });
        }

        console.log('Email sent successfully:', data);
        return res
            .status(200)
            .json({ message: 'Email sent successfully', data });
    } catch (e) {
        console.error('Unexpected error:', e);
        return res
            .status(500)
            .json({ message: 'Internal Server Error', error: e.message });
    }
};
