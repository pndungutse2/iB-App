import { Schema, model } from 'mongoose';

const shoppingListSchema = new Schema({
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    totalSpent: { type: Number, default: 0 },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

export default model('ShoppingList', shoppingListSchema);