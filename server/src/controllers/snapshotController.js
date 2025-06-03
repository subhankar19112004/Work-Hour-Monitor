import Attendance from '../models/Attendance.js';
import Snapshot from '../models/Snapshot.js';
const uploadSnapshot = async (req, res) => {
  try {
    console.log("Authenticated user in snapshot upload:", req.user);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({ message: 'Photo (base64) is required' });
    }

    // Get today's date and reset time to midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight to compare only the date

    console.log("Checking attendance for user on date:", today);

    // Query to check if the user has punched in today
    const attendance = await Attendance.findOne({
      user: req.user.userId,         // Match user _id from req.user
      date: { $gte: today },          // Check if date is today or after midnight (ignoring time)
      punchInTime: { $ne: null },     // Ensure the user has punched in
      punchOutTime: { $eq: null },    // Ensure the user hasn't punched out yet
    });

    // Log the attendance for debugging
    console.log("Attendance found:", attendance);

    if (!attendance) {
      return res.status(404).json({ message: 'No punch-in record found for today' });
    }

    // Create the snapshot record
    const snapshot = await Snapshot.create({
      user: req.user.userId,
      attendance: attendance._id,
      photo,
      time: new Date(),
    });

    res.status(201).json({ message: 'Snapshot saved', snapshot });
  } catch (error) {
    console.error('Error saving snapshot:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default uploadSnapshot;

const getSnapshots = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can view all snapshots.' });
    }

    // Fetch all snapshots and populate the user field to get username
    const snapshots = await Snapshot.find()
      .populate('user', 'name')  // Populate user field and select only the 'name'
      .sort({ time: -1 });  // Optional: Sort snapshots by time (newest first)

    // Return the snapshots along with user information
    res.status(200).json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export { getSnapshots };
