import Attendance from "../models/Attendance.js";

// Punch In
export const punchIn = async (req, res) => {
  try {
    const { photo } = req.body;
    if (!photo) return res.status(400).json({ message: "Photo is required for punch-in" });

    const userId = req.user.userId;
    const today = new Date().toISOString().slice(0, 10);

    const alreadyPunchedIn = await Attendance.findOne({ user: userId, date: today });
    if (alreadyPunchedIn) return res.status(400).json({ message: "Already punched in today" });

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

// Punch Out
export const punchOut = async (req, res) => {
  try {
    const { photo } = req.body;
    const userId = req.user.userId;
    const today = new Date().toISOString().slice(0, 10);

    const attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) return res.status(404).json({ message: "No punch-in record found for today" });
    if (attendance.punchOutTime) return res.status(400).json({ message: "Already punched out today" });

    attendance.punchOutTime = new Date();
    attendance.punchOutPhoto = photo;

    const punchInTime = new Date(attendance.punchInTime);
    const punchOutTime = new Date(attendance.punchOutTime);
    const diff = punchOutTime - punchInTime;

    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const totalMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    attendance.totalWorkTime = `${totalHours} hours ${totalMinutes} minutes`;

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
