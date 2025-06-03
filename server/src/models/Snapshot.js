import mongoose from 'mongoose';

const snapshotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attendance: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
  time: { type: Date, default: Date.now },
  photo: { type: String, required: true }, // base64 string
  createdAt: { type: Date, default: Date.now, expires: '24h' },  // TTL set to 24 hours
});

// Create the Snapshot model
const Snapshot = mongoose.model("Snapshot", snapshotSchema);

export default Snapshot;
