const express = require('express');
const multer = require('multer');
const openai = require('../services/openaiClient');
const Product = require('../models/Product');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/identify-product', upload.single('photo'), async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Use OpenAI to identify the product from the photo
        const response = await openai.createImageClassification({
            image: file.path,
            model: 'your_model_id', // Replace with your model ID
        });

        const productDetails = response.data;

        // Save product details to the database
        const product = new Product({
            name: productDetails.name,
            category: productDetails.category,
            barcode: productDetails.barcode,
            price: productDetails.price,
            store: req.body.storeId,
            datePurchased: new Date(),
        });

        await product.save();

        res.status(201).json({ message: 'Product identified and saved successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to identify and save product' });
    }
});

module.exports = router;