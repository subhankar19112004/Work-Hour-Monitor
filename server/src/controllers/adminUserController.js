import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import Attendance from '../models/Attendance.js';

// Get all users — admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // This fetches all users from the database
    res.status(200).json(users); // Send the users as the response
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err });
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

export const getActivePunchedInUsers = async (req, res) => {
  try {
    // Fetch all active users
    const activeUsers = await User.find({ status: 'active' });

    // Fetch all attendance records for these users where punch-in exists and punch-out is null
    const activeAttendances = await Attendance.find({
      user: { $in: activeUsers.map(user => user._id) },
      punchOutTime: null, // If punchOutTime is null, the user is still punched in
    }).populate('user', 'name email role');

    res.status(200).json({
      success: true,
      users: activeAttendances,  // Return the active punched-in users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active punched-in users.',
    });
  }
};

// Get all users' attendance history (admin only)
export const getUserAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await Attendance.find({ user: userId }).sort({ date: -1 });

    // Map through attendance logs and calculate total work time if it exists
    const formattedLogs = logs.map(log => {
      return {
        date: log.date,
        punchInTime: log.punchInTime,
        punchOutTime: log.punchOutTime,
        totalWorkTime: log.totalWorkTime,
      };
    });

    res.status(200).json(formattedLogs);
  } catch (error) {
    console.error("History fetch error:", error.message);
    res.status(500).json({ msg: "Failed to fetch attendance history" });
  }
};


// Get all users' attendance history (admin only)
export const getAllUsersAttendanceHistory = async (req, res) => {
  try {
    // Fetch all attendance records and populate user details (name, email, and role)
    const attendanceRecords = await Attendance.find()
      .populate('user', 'name email role')
      .sort({ date: -1 }); // Sort attendance records by date (descending)

    if (attendanceRecords.length === 0) {
      return res.status(200).json({ message: "No attendance records found." });
    }

    res.status(200).json({
      success: true,
      attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching all users' attendance history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

