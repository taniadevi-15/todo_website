import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

// 📌 Zod Schema
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});


// ✅ Register Controller
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // 1. Check for required fields
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Zod validation
    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(err => err.message);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // 4. Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email.toLowerCase(),
      username,
      password: hashedPassword
    });

    await newUser.save();

    // 5. Generate token and send
    const token = generateTokenAndSaveInCookies(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};


// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate token
    const token = generateTokenAndSaveInCookies(user._id, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


// ✅ Logout Controller
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};
