const {Resend} = require('resend');

const resend = new Resend('re_bakksHNM_8WfM353ZjM8z7isNH7F4yM1a');

exports.testEmailSender = async (req, res, next) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['deadpoolzrx@gmail.com'],
            subject: 'Hello World',
            html: '<strong>It works!</strong>',
        });

        if (error) {
            console.error('Email sending failed:', error);
            return res.status(500).json({ message: 'Failed to send email', error });
        }

        console.log('Email sent successfully:', data);
        return res.status(200).json({ message: 'Email sent successfully', data });
    } catch (e) {
        console.error('Unexpected error:', e);
        return res.status(500).json({ message: 'Internal Server Error', error: e.message });
    }
};