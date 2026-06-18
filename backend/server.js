import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/connect.js';
import userRoutes from './routes/userRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

config();

const app = express();

// Parse JSON data
app.use(express.json());
// Parse cookies
app.use(cookieParser());

// Enable CORS for frontend connection with credentials support
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// API Routes registration
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);

// Database connection initialization
connectDB();

// Handle invalid path 404s
app.use((req, res, next) => {
  res.status(404).json({ message: `path ${req.url} is invalid` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error handler:', err.name, err.message);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "validation error", error: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "cast error", error: err.message });
  }
  res.status(500).json({ message: "Server side error", error: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
