import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import attendanceRoutes from './routes/attendanceRoute.js';
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow the frontend's URL (update if necessary)
  methods: ['GET', 'POST'],
  credentials: true
}));

// Increase the body size limit for parsing large JSON payloads (e.g., Base64 image strings)
app.use(express.json({ limit: '50mb' })); // Increase this limit if needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // If you're also expecting URL-encoded data

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use('/api', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("👋 Welcome to Work Hour Monitor API");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
