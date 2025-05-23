import express from 'express';
import { punchIn, punchOut } from '../controllers/attendance.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/punch-in', protect, punchIn);
router.post('/punch-out', protect, punchOut);

export default router;
