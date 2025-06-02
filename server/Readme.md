import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import attendanceRoutes from './routes/attendanceRoute.js';
import cors from "cors";
import { startAutoPunchOutJob } from "./jobs/autoPunchOut.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // ✅ Allow PUT
  credentials: true
}));


// Increase the body size limit for parsing large JSON payloads (e.g., Base64 image strings)
app.use(express.json({ limit: '50mb' })); // Increase this limit if needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // If you're also expecting URL-encoded data

// Connect DB
connectDB();
//autoPunchOut at 11pm 
startAutoPunchOutJob();

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("👋 Welcome to Work Hour Monitor API");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});   
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

import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

// POST route to register a new user
router.post("/register", register);

// POST route to log in a user
router.post("/login", login);

export default router;

import express from 'express';
import { getAllUsersAttendance, getUserAttendanceHistory, punchIn, punchOut } from '../controllers/attendance.js';
import protect from '../middlewares/auth.js';
import { getTodayAttendance } from '../controllers/getTodayAttendance.js'; // ✅ NEW IMPORT
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { getActivePunchedInUsers, getAllUsersAttendanceHistory } from '../controllers/adminUserController.js';

const router = express.Router();

router.post('/punch-in', protect, punchIn);
router.post('/punch-out', protect, punchOut);
router.get('/today', protect, getTodayAttendance); // ✅ NEW ROUTE
router.get('/history', protect, getUserAttendanceHistory);
router.get('/all', protect, isAdmin, getAllUsersAttendance);
// New route for fetching active punched-in users
router.get('/active-punched-in-users', protect, isAdmin, getActivePunchedInUsers);
router.get('/admin/all-history', protect, isAdmin, getAllUsersAttendanceHistory);  // Admin protected route


export default router;



import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  profileUrl: {
    type: String,
    default: "https://files.slack.com/files-pri/T08J90YLEQK-F08TM5S4S2F/png_new.png", // default avatar
  },
}, {
  timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;

// import mongoose from 'mongoose';

// const AttendanceSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     punchInTime: {
//       type: Date,
//     },                                                      
//     punchOutTime: {
//       type: Date,
//     },
//     punchInPhoto: {
//       type: String,
//     },  
//     punchOutPhoto: {
//       type: String,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//       expires: 60 * 60 * 24 * 30, // 30 days in seconds
//     },
//   },
//   { timestamps: true }
// );

// const Attendance = mongoose.model('Attendance', AttendanceSchema);
// export default Attendance;


import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    punchInTime: {
      type: Date,
    },
    punchOutTime: {
      type: Date,
    },
    punchInPhoto: {
      type: String,
    },
    punchOutPhoto: {
      type: String,
    },
    totalWorkTime: {
      type: String, // Store the total time worked as a string (e.g., "4 hours 30 minutes")
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // 30 days in seconds
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model('Attendance', AttendanceSchema);
export default Attendance;


 import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {
    // Extract the token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, auth denied" });

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    // Attach the decoded user data to req.user
    req.user = decoded;

    console.log("Decoded user data:", decoded);  // Check the decoded token

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default protect;

// middleware/adminMiddleware.js
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ msg: 'Access denied: Admins only' });
};

import cron from 'node-cron';
import Attendance from '../models/Attendance.js';

// Run every day at 11:00 PM server time
export const startAutoPunchOutJob = () => {
  cron.schedule('0 23 * * *', async () => {
    const today = new Date().toISOString().slice(0, 10);

    try {
      const unpunchedUsers = await Attendance.find({
        date: today,
        punchInTime: { $ne: null },
        punchOutTime: null
      });

      for (let userAttendance of unpunchedUsers) {
        const punchOutTime = new Date(`${today}T23:00:00`);
        const punchInTime = new Date(userAttendance.punchInTime);

        const diffMs = punchOutTime - punchInTime;
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const totalWorkTime = `${totalHours} hours ${totalMinutes} minutes`;

        userAttendance.punchOutTime = punchOutTime;
        userAttendance.punchOutPhoto = null;
        userAttendance.totalWorkTime = totalWorkTime;

        await userAttendance.save();
      }

      console.log(`[AUTO PUNCH-OUT] Completed for ${unpunchedUsers.length} users at 11PM`);
    } catch (err) {
      console.error("[AUTO PUNCH-OUT] Error:", err.message);
    }
  });
};

import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Extract only the fields we allow to update
    const { profileUrl, age, gender } = req.body;

    const updateData = {};

    if (profileUrl !== undefined) updateData.profileUrl = profileUrl;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) {
  // Capitalize first letter only
  updateData.gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // do not return password

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

import Attendance from '../models/Attendance.js';

export const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const todayDate = new Date().toISOString().slice(0, 10);

    const attendance = await Attendance.findOne({
      user: userId,
      date: todayDate,
    });

    if (!attendance) {
      return res.status(200).json({
        punchInTime: null,
        punchOutTime: null,
      });
    }

    res.status(200).json({
      punchInTime: attendance.punchInTime,
      punchOutTime: attendance.punchOutTime,
    });
  } catch (error) {
    console.error('Fetch today attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); // sends back entire user object except password
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// src/controllers/authController.js
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DEFAULT_PROFILE_URL = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// Utils: generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, profileUrl, role } = req.body;

    if (!name || !email || !password || !age || !gender) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      role: role || 'employee', // manually pass role = 'admin' via Postman if needed
      profileUrl: profileUrl || DEFAULT_PROFILE_URL,
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        role: newUser.role,
        profileUrl: newUser.profileUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      msg: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        role: user.role,
        profileUrl: user.profileUrl || DEFAULT_PROFILE_URL,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};  

import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// Punch In function
export const punchIn = async (req, res) => {
  try {
    const { photo } = req.body;
    if (!photo) return res.status(400).json({ message: "Photo is required for punch-in" });

    const userId = req.user.userId;
    const today = new Date().toISOString().slice(0, 10);

    // Check if the user has already punched in today
    const alreadyPunchedIn = await Attendance.findOne({ user: userId, date: today });
    if (alreadyPunchedIn) return res.status(400).json({ message: "Already punched in today" });

    // Update user's status to active
    await User.findByIdAndUpdate(userId, { status: 'active' });

    // Create the attendance record for the user
    const attendance = new Attendance({
      user: userId,
      date: today,
      punchInTime: new Date(),
      punchInPhoto: photo,
    });

    await attendance.save();

    res.status(201).json({
      message: "Punched in successfully",
      punchInTime: attendance.punchInTime,
      attendance,
    });
  } catch (error) {
    console.error("Punch-in error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Punch Out function
export const punchOut = async (req, res) => {
  try {
    const { photo } = req.body;
    const userId = req.user.userId;
    const today = new Date().toISOString().slice(0, 10);

    const attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) return res.status(404).json({ message: "No punch-in record found for today" });
    if (attendance.punchOutTime) return res.status(400).json({ message: "Already punched out today" });

    // Set the punch-out time and update the status to 'inactive'
    attendance.punchOutTime = new Date();
    attendance.punchOutPhoto = photo;

    const punchInTime = new Date(attendance.punchInTime);
    const punchOutTime = new Date(attendance.punchOutTime);
    const diff = punchOutTime - punchInTime;

    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const totalMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    attendance.totalWorkTime = `${totalHours} hours ${totalMinutes} minutes`;

    // Update user's status to 'inactive' once they punch out
    await User.findByIdAndUpdate(userId, { status: 'inactive' });

    await attendance.save();

    res.status(200).json({
      message: "Punched out successfully",
      punchInTime: attendance.punchInTime,
      punchOutTime: attendance.punchOutTime,
      totalWorkTime: attendance.totalWorkTime,
      attendance,
    });
  } catch (error) {
    console.error("Punch-out error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔥 New: Attendance History for Logged-in User
export const getUserAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await Attendance.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error("History fetch error:", error.message);
    res.status(500).json({ msg: "Failed to fetch attendance history" });
  }
};

// controllers/attendance.js
export const getAllUsersAttendance = async (req, res) => {
  try {
    const allAttendance = await Attendance.find().populate('user', 'name email role');
    res.status(200).json(allAttendance);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};




import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import Attendance from '../models/Attendance.js';

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
            users: activeAttendances,
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
export const getAllUsersAttendanceHistory = async (req, res) => {
  try {
    // Only admin can access this
    const attendanceRecords = await Attendance.find().populate('user', 'name email role').sort({ date: -1 });

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





import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit on fail
  }
};

export default connectDB;   


analyze properly all the codes
