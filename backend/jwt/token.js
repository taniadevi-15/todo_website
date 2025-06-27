import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // ✅ Required on Render (HTTPS)
    sameSite: "None", // ✅ Required when frontend & backend are on different domains
    path: "/",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });

  // Optional: remove this line if you're not using `token` field in DB
  await User.findByIdAndUpdate(userId, { token });

  return token;
};
