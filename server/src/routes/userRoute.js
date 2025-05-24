import express from 'express';
import protect from '../middlewares/auth.js';
import { getMe } from '../controllers/getMe.js';
import { updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile); // ✅ New route

export default router;
