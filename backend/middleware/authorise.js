import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user from DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
