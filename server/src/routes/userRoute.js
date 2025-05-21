import express from 'express';
import protect from '../middlewares/auth.js';
import { getMe } from '../controllers/getMe.js';

const router = express.Router();

// Protected route to get logged-in user's profile
router.get('/me', protect, getMe);

export default router;
