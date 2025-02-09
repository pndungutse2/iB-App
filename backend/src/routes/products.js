import { Router } from 'express';
const router = Router();
import Product, { find, countDocuments } from '../models/Product';
import { fetchProductByBarcode } from '../services/barcodeServices';

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

// Get paginated products
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
        const products = await find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const totalProducts = await countDocuments();

        res.status(200).json({
            data: products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch paginated products' });
    }
});

export default router;