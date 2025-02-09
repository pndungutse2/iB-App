import { Router } from 'express';
import { createTransport } from 'nodemailer';
import Product from '../models/Product';

const router = Router();

// Configure nodemailer to use Amazon SES SMTP
const transporter = createTransport({
    host: process.env.SES_SMTP_HOST,
    port: process.env.SES_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SES_ACCESS_KEY_ID,
        pass: process.env.SES_SECRET_ACCESS_KEY
    }
});

// Send notification email
router.post('/send-notification', async (req, res) => {
    const { email, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

export default router;