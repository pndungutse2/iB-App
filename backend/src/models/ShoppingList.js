const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
    name: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    totalSpent: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
