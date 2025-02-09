import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import User, { findOne } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Username or email already exists' });
        } else {
            res.status(400).json({ error: 'Registration failed' });
        }
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;