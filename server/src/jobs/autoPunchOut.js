import cron from 'node-cron';
import Attendance from '../models/Attendance.js';

// Run every day at 11:00 PM server time
export const startAutoPunchOutJob = () => {
  cron.schedule('0 23 * * *', async () => { // Runs every day at 11:00 PM server time
    const today = new Date().toISOString().slice(0, 10);  // Get today's date in YYYY-MM-DD format

    console.log('[AUTO PUNCH-OUT] Job triggered at', new Date().toISOString());

    try {
      // Fetch users who are punched in but have not punched out yet
      const unpunchedUsers = await Attendance.find({
        date: today,
        punchInTime: { $ne: null }, // Ensure punchInTime is not null
        punchOutTime: null,         // Ensure punchOutTime is null
      });

      console.log(`Found ${unpunchedUsers.length} users to punch out.`);

      // Process each user
      for (let userAttendance of unpunchedUsers) {
        const punchOutTime = new Date(`${today}T23:00:00`); // Set punch-out time at 11:00 PM
        const punchInTime = new Date(userAttendance.punchInTime); // Get punch-in time from attendance record

        // Calculate the total work time
        const diffMs = punchOutTime - punchInTime;
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const totalWorkTime = `${totalHours} hours ${totalMinutes} minutes`;

        // Update the attendance record with punch-out details
        userAttendance.punchOutTime = punchOutTime;
        userAttendance.punchOutPhoto = null; // Clear punch-out photo (optional)
        userAttendance.totalWorkTime = totalWorkTime;

        // Save the updated attendance record
        await userAttendance.save();
      }

      console.log(`[AUTO PUNCH-OUT] Completed for ${unpunchedUsers.length} users at 11 PM`);

    } catch (err) {
      console.error("[AUTO PUNCH-OUT] Error:", err.message);
    }
  });
};
