 import Attendance from '../models/Attendance.js';

// // Punch In Controller
// export const punchIn = async (req, res) => {
//   try {
//     // Log user data to ensure req.user is populated correctly
//     console.log("User in punch-in controller:", req.user);

//     // Ensure req.user is populated and contains the correct userId
//     if (!req.user || !req.user.userId) {
//       return res.status(400).json({ message: "User not found in request" });
//     }

//     const { photo } = req.body;

//     if (!photo) {
//       return res.status(400).json({ message: "Photo is required for punch-in" });
//     }

//     const userId = req.user.userId;  // Access userId from req.user (ensure you are using the correct key)
//     console.log("User ID for punch-in:", userId);

//     // Check if the user has already punched in today
//     const alreadyPunchedIn = await Attendance.findOne({
//       user: userId,
//       date: new Date().toISOString().slice(0, 10),  // Today's date
//     });

//     if (alreadyPunchedIn) {
//       return res.status(400).json({ message: "Already punched in today" });
//     }

//     // Create and save attendance record
//     const attendance = new Attendance({
//       user: userId,
//       date: new Date().toISOString().slice(0, 10),
//       punchInTime: new Date(),
//       punchInPhoto: photo,
//     });

//     await attendance.save();

//     res.status(201).json({ message: "Punched in successfully", attendance });
//   } catch (error) {
//     console.error("Punch-in error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const punchIn = async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({ message: "Photo is required for punch-in" });
    }

    const userId = req.user.userId; // Access the userId from req.user
    const today = new Date().toISOString().slice(0, 10); // Today's date

    // Check if the user has already punched in today
    const alreadyPunchedIn = await Attendance.findOne({
      user: userId,
      date: today,
    });

    if (alreadyPunchedIn) {
      return res.status(400).json({ message: "Already punched in today" });
    }

    // Create a new attendance record with punch-in time
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




// Punch Out Controller
export const punchOut = async (req, res) => {
  try {
    const { photo } = req.body;

    const userId = req.user.userId;  // Access user ID from the decoded token

    const today = new Date().toISOString().slice(0, 10);

    // Find the attendance record for the user for today
    const attendance = await Attendance.findOne({
      user: userId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({ message: "No punch-in record found for today" });
    }

    if (attendance.punchOutTime) {
      return res.status(400).json({ message: "Already punched out today" });
    }

    // Set the punch-out time
    attendance.punchOutTime = new Date();
    attendance.punchOutPhoto = photo;

    // Calculate the total work time (in hours and minutes)
    const punchInTime = new Date(attendance.punchInTime);
    const punchOutTime = new Date(attendance.punchOutTime);

    // Calculate the difference in milliseconds
    const timeDifference = punchOutTime - punchInTime;

    // Convert the difference from milliseconds to hours and minutes
    const totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const totalMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Format the total work time as "X hours Y minutes"
    const totalWorkTime = `${totalHours} hours ${totalMinutes} minutes`;

    // Store the total work time in the attendance record
    attendance.totalWorkTime = totalWorkTime;

    // Save the updated attendance record
    await attendance.save();

    // Return the response with the punch-in, punch-out times, and total work time
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