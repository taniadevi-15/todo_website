import React, { useEffect, useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PageNotFound from "./components/PageNotFound";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const token = localStorage.getItem("jwt");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen h-[150vh] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <Routes>
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
