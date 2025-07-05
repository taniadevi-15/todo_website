
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
function Signup() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(
      "https://todo-websitee.onrender.com/user/signup",
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    // console.log(data);
    toast.success(data.message || "User registered successfully");
    localStorage.setItem("jwt", data.token);
    navigateTo("/login");
    setUserName("");
    setEmail("");
    setPassword("");
  } catch (error) {
    console.log("Signup error:", error);
    toast.error(error?.response?.data?.errors || "User registration failed");
  }
};

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 transition-all">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg shadow-lg transition-all">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Type Username"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type Email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type Password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-900 text-white font-semibold p-3 rounded-xl transition"
          >
            Signup
          </button>

          {/* Login Redirect */}
          <p className="text-center text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
