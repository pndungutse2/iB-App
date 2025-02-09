import { Router } from 'express';
const router = Router();
import ShoppingList from '../models/ShoppingList';
import { find } from '../models/Product';

// Create a shopping list and calculate total spent
router.post('/', async (req, res) => {
    const { name, productIds, storeId } = req.body;

    try {
        // Fetch all products
        const products = await find({ _id: { $in: productIds } });
        const totalSpent = products.reduce((sum, product) => sum + (product.price || 0), 0);

        // Create and save the shopping list
        const shoppingList = new ShoppingList({ name, products: productIds, store: storeId, totalSpent });
        await shoppingList.save();

        res.status(201).json({ message: 'Shopping list created', shoppingList });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create shopping list' });
    }
});

export default router;