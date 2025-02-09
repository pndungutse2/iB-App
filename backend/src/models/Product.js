import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Grocery', 'Electronics', 'Clothing', 'Others'], required: true },
    barcode: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    datePurchased: { type: Date, default: Date.now }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

export default model('Product', productSchema);