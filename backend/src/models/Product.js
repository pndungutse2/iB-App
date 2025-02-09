const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    category: { type: String, enum: ['Grocery', 'Electronics', 'Clothing', 'Others'] },
    barcode: { type: String, unique: true },
    price: Number,
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    datePurchased: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
