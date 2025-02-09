require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');
const shoppingListRoutes = require('./routes/shoppingLists');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/shopping-lists', authMiddleware, shoppingListRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));