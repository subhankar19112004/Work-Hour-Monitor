import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// Punch In function
export const punchIn = async (req, res) => {
  try {
    const { photo } = req.body;
    if (!photo) return res.status(400).json({ message: "Photo is required for punch-in" });

    const userId = req.user.userId;
    const today = new Date().toISOString().slice(0, 10);  // Get today's date

    // Check if the user has already punched in today
    const alreadyPunchedIn = await Attendance.findOne({ user: userId, date: today });
    if (alreadyPunchedIn) return res.status(400).json({ message: "Already punched in today" });

    // Create the attendance record for the user
    const attendance = new Attendance({
      user: userId,
      date: today,
      punchInTime: new Date(),  // Save current time as punch-in time
      punchInPhoto: photo,
    });

    await attendance.save();  // Save the attendance record

    // Update the user's status to active after successful punch-in
    await User.findByIdAndUpdate(userId, { status: 'active' });

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


