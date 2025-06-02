import express from 'express';
import { requestLeave, approveLeave, rejectLeave, getAllLeaveRequests } from '../controllers/leaveController.js';
import protect from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/request', protect, requestLeave); // Employee requesting leave
router.put('/approve/:id', protect, isAdmin, approveLeave); // Admin approving leave
router.put('/reject/:id', protect, isAdmin, rejectLeave); // Admin rejecting leave
router.get('/all', protect, isAdmin, getAllLeaveRequests);

export default router;
