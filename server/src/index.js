import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";

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
app.use(express.json()); // Parses JSON body

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use('/api', userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("👋 Welcome to Work Hour Monitor API");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
