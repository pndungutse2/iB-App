require('dotenv').config();
import express, { json } from 'express';
import { connect } from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import productRoutes from './routes/products';
import shoppingListRoutes from './routes/shoppingLists';
import authRoutes from './routes/auth';
import analyticsRoutes from './routes/analytics';
import authMiddleware from './middlewares/auth';

const app = express();
app.use(json());
app.use(helmet());
app.use(compression());
app.use(cors());

// Connect to MongoDB
(async () => {
    try {
        await connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
})();

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/shopping-lists', authMiddleware, shoppingListRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
