import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  // ✅ Redirect to home if already logged in
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      navigateTo("/");
    }
  }, [navigateTo]);

  // ✅ Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://todo-websitee.onrender.com/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message || "Login successful");
      localStorage.setItem("jwt", data.token);

      // ✅ Optional: small delay before redirect
      setTimeout(() => {
        navigateTo("/");
      }, 500);

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 transition-all">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg shadow-lg transition-all">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-900 text-white font-semibold p-3 rounded-xl transition"
          >
            Login
          </button>

          {/* Signup Redirect */}
          <p className="text-center text-gray-600 dark:text-gray-300">
            New user?{" "}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
