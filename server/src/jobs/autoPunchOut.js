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
