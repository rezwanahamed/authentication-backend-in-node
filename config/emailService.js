const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_SERVER_EMAIL,
        pass: process.env.SMTP_SERVER_PASSWORD
      }
    });
  }

  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

// Function to send a simple email
async function sendSimpleEmail(to, subject, emailBody) {
  try {
    const emailService = new EmailService();
    await emailService.sendEmail({
      to,
      subject,
      html: emailBody
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

module.exports = {
  EmailService: new EmailService(),
  sendSimpleEmail
};
