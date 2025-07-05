import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

// Zod validation schema
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// ✅ Register Controller
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // 1. Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    // 2. Validate using Zod
    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      const errorMessages = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ errors: errorMessages });
    }

    // 3. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already registered" });
    }

    // 4. Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    // 5. Generate token and store in cookie
    const token = await generateTokenAndSaveInCookies(newUser._id, res);
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
  const { email, password } = req.body;
  // console.log("➡️ Login request received:", email);

  try {
    if (!email || !password) {
      // console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // console.log("❌ User not found");
      return res.status(401).json({ errors: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // console.log("❌ Password mismatch");
      return res.status(401).json({ errors: "Invalid email or password" });
    }

    // console.log("✅ User authenticated");

    let token;
    try {
      token = generateTokenAndSaveInCookies(user._id, res);
      // console.log("✅ Token generated:", token);
    } catch (tokenErr) {
      // console.error("❌ Error generating token:", tokenErr);
      return res.status(500).json({ message: "Token generation failed" });
    }

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
    // console.error("❌ Login error (outer catch):", error);
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
