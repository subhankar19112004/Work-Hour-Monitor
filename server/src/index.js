import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoute.js';
import attendanceRoutes from './routes/attendanceRoute.js';
import cors from 'cors';
import { startAutoPunchOutJob } from './jobs/autoPunchOut.js';
import leaveRoutes from './routes/leaveRoutes.js';
import snapshotRoutes from './routes/snapshotRoutes.js';
import cron from 'node-cron';  // Add cron for manual snapshot deletion


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
// Auto-punch-out job at 11 PM
startAutoPunchOutJob();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/snapshot', snapshotRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('👋 Welcome to Work Hour Monitor API');
});

// Start cron job for manual snapshot deletion (if TTL is not used)
cron.schedule('0 * * * *', async () => {  // Every hour
  try {
    // Delete snapshots older than 24 hours manually
    const result = await Snapshot.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours ago
    });
    console.log(`Deleted ${result.deletedCount} snapshots older than 24 hours.`);
  } catch (err) {
    console.error('Error deleting old snapshots:', err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
