import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Get all users — admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error('Get all users error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a user — admin only
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ msg: 'User ID required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await user.deleteOne();
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user role (e.g., promote employee to admin or demote)
// Could be more granular with role validation if you want
export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!['admin', 'employee'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role value' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({ msg: 'User role updated', user });
  } catch (err) {
    console.error('Update user role error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// In controllers/userController.js
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive ?? user.isActive;

  const updatedUser = await user.save();
  res.json(updatedUser);
});

