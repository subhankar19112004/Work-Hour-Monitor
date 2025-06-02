import Attendance from '../models/Attendance.js';

export const getTotalWorkHoursStats = async (req, res) => {
  try {
    const { period } = req.query; // Accept day, week, or month as query parameters
    let startDate, endDate;

    // Define date range based on the period
    if (period === 'day') {
      startDate = new Date().setHours(0, 0, 0, 0); // Start of today
      endDate = new Date().setHours(23, 59, 59, 999); // End of today
    } else if (period === 'week') {
      const today = new Date();
      const firstDayOfWeek = today.getDate() - today.getDay(); // Get the first day of the week (Sunday)
      startDate = new Date(today.setDate(firstDayOfWeek));
      endDate = new Date(today.setDate(firstDayOfWeek + 6)); // End of the week (Saturday)
    } else if (period === 'month') {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month
    }

    // Query attendance records within the date range
    const attendanceRecords = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalWorkTime: { $sum: "$totalWorkTime" },
        }
      }
    ]);

    res.status(200).json({ totalWorkTime: attendanceRecords[0].totalWorkTime });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating work hours', error: error.message });
  }
};
