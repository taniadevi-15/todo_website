import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const DB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173", // For local dev
  "https://todo-website2e.onrender.com", // ✅ Your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// Health check route
app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

// Routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// Start server after DB connection
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
