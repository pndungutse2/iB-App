const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { fetchProductByBarcode } = require('../services/barcodeService');

// Add a new product by scanning a barcode
router.post('/scan', async (req, res) => {
    const { barcode, storeId } = req.body;

    try {
        // Fetch product details using barcode service
        const productData = await fetchProductByBarcode(barcode);
        
        // Create and save product in the database
        const product = new Product({
            ...productData,
            barcode,
            store: storeId
        });
        await product.save();

        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            data: products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch paginated products' });
    }
});

module.exports = router;
