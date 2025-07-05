import jwt from "jsonwebtoken";

export const generateTokenAndSaveInCookies = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None", // important for cross-origin if frontend is on different domain
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
};
