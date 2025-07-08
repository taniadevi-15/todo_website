import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setTimeout(() => navigate("/"), 300); // ensure router is ready (esp. on mobile)
    } else {
      setLoading(false);
    }
  }, [navigate]);

  // 🔁 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://todo-websitee.onrender.com/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message || "Login successful");
      localStorage.setItem("jwt", data.token);

      setTimeout(() => navigate("/"), 500); // gives mobile time to mount
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  // ⏳ Loading screen for small/mobile devices
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <span className="text-lg animate-pulse">Checking login...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl shadow-lg transition-all">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            New here?{" "}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
