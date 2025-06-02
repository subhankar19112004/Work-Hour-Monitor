import express from 'express';
import { getAllUsersAttendance, getUserAttendanceHistory, punchIn, punchOut } from '../controllers/attendance.js';
import protect from '../middlewares/auth.js';
import { getTodayAttendance } from '../controllers/getTodayAttendance.js'; // ✅ NEW IMPORT
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { getActivePunchedInUsers, getAllUsersAttendanceHistory} from '../controllers/adminUserController.js';
import { getTotalWorkHoursStats } from '../controllers/getTotalWorkHoursStats.js';

const router = express.Router();

router.post('/punch-in', protect, punchIn);
router.post('/punch-out', protect, punchOut);
router.get('/today', protect, getTodayAttendance); // ✅ NEW ROUTE
router.get('/history', protect, getUserAttendanceHistory);
router.get('/all', protect, isAdmin, getAllUsersAttendance);
// New route for fetching active punched-in users
router.get('/active-punched-in-users', protect, isAdmin, getActivePunchedInUsers);
router.get('/admin/all-history', protect, isAdmin, getAllUsersAttendanceHistory);  // Admin protected route
router.get('/total-hours', protect, getTotalWorkHoursStats); // Admin or Employee view total work hours stats



export default router;
