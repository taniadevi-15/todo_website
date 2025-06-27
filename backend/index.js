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

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://todo-website-1-gboi.onrender.com", // ✅ Frontend live URL
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is live ✅");
});

// Routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// Start server only after DB connects
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
};

startServer();
