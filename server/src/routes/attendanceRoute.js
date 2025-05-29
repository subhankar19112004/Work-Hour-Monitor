import express from 'express';
import { getAllUsersAttendance, getUserAttendanceHistory, punchIn, punchOut } from '../controllers/attendance.js';
import protect from '../middlewares/auth.js';
import { getTodayAttendance } from '../controllers/getTodayAttendance.js'; // ✅ NEW IMPORT
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/punch-in', protect, punchIn);
router.post('/punch-out', protect, punchOut);
router.get('/today', protect, getTodayAttendance); // ✅ NEW ROUTE
router.get('/history', protect, getUserAttendanceHistory);
router.get('/all', protect, isAdmin, getAllUsersAttendance);


export default router;
