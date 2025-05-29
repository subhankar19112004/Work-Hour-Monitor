import express from 'express';
import protect from '../middlewares/auth.js';
import { getMe } from '../controllers/getMe.js';
import { updateProfile } from '../controllers/userController.js';
import { deleteUser, getAllUsers, updateUserByAdmin, updateUserRole } from '../controllers/adminUserController.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile); // ✅ New route


//admin
router.get('/', protect, isAdmin, getAllUsers); // list all users
router.delete('/:id', protect, isAdmin, deleteUser); // delete user
router.put('/:id/role', protect, isAdmin, updateUserRole); // update user role
// In routes/userRoutes.js
router.put('/:id', protect, isAdmin, updateUserByAdmin);


export default router;
