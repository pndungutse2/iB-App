const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, default: 'Unknown' },
    totalSpent: { type: Number, default: 0 }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('Store', storeSchema);
