import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;
