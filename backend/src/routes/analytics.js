const express = require('express');
const nodemailer = require('nodemailer');
const Product = require('../models/Product').default;

const router = express.Router();

// Configure nodemailer to use Amazon SES SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SES_SMTP_HOST,
    port: process.env.SES_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SES_ACCESS_KEY_ID,
        pass: process.env.SES_SECRET_ACCESS_KEY
    }
});

// Send monthly expense report
router.post('/send-monthly-report', async (req, res) => {
    const { email, month, year } = req.body;

    try {
        // Calculate the monthly total expenses
        const expenses = await Product.aggregate([
            {
                $match: {
                    datePurchased: {
                        $gte: new Date(`${year}-${month}-01`),
                        $lt: new Date(`${year}-${month + 1}-01`)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$price' },
                    productCount: { $sum: 1 }
                }
            }
        ]);

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Monthly Expense Report - ${month}/${year}`,
            text: `You spent a total of $${expenses[0]?.totalSpent || 0} on ${expenses[0]?.productCount || 0} products in ${month}/${year}.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Monthly report sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send monthly report' });
    }
});

module.exports = router;