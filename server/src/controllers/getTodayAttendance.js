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
