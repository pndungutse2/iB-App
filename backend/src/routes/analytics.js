const express = require('express');
const Product = require('../models/Product');
const ShoppingList = require('../models/ShoppingList');
const nodemailer = require('nodemailer');
const Product = require('../models/Product');
const router = express.Router();


// Total spending per category
router.get('/spending-per-category', async (req, res) => {
    try {
        const data = await Product.aggregate([
            { $group: { _id: '$category', totalSpent: { $sum: '$price' } } }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Spending per store
router.get('/spending-per-store', async (req, res) => {
    try {
        const data = await ShoppingList.aggregate([
            {
                $group: {
                    _id: '$store',
                    totalSpent: { $sum: '$totalSpent' },
                    itemCount: { $sum: { $size: '$products' } }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch store spending' });
    }
});

// Spending trends over time
router.get('/spending-trends', async (req, res) => {
    try {
        const data = await Product.aggregate([
            {
                $group: {
                    _id: { $month: '$datePurchased' },
                    totalSpent: { $sum: '$price' },
                    productCount: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch spending trends' });
    }
});

// Spending trends with detailed breakdown by month and year
router.get('/spending-trends-detail', async (req, res) => {
    try {
        const data = await Product.aggregate([
            {
                $group: {
                    _id: { month: { $month: '$datePurchased' }, year: { $year: '$datePurchased' } },
                    totalSpent: { $sum: '$price' },
                    productCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch detailed spending trends' });
    }
});

// Spending per store with breakdown by category
router.get('/spending-store-category', async (req, res) => {
    try {
        const data = await Product.aggregate([
            {
                $group: {
                    _id: { store: '$store', category: '$category' },
                    totalSpent: { $sum: '$price' }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch spending by store and category' });
    }
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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

