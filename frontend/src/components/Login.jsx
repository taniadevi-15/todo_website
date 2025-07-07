import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [loading,setLoading]=useState(false)
  let [error,setError]=useState("")
  const navigate = useNavigate();

  const handleLogin = async (e) => {
     e.preventDefault();
  setLoading(true);
  setError('');
    try {
      const { result } = await axios.post(
        "https://todo-websitee.onrender.com/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(result.message || "User logged in successfully");

      

    if (result?.data) {
      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));
      navigate('/');
      setEmail('');
      setPassword('');
    } else {
      setError("Unexpected response from server");
    }

  } catch (err) {
    console.error("Login error:", err);
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Login failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

 
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-center text-gray-800 dark:text-white">
          Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type Email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition duration-300 rounded-xl font-semibold p-3"
          >
            Login
          </button>

         <p className='cursor-pointer mt-3' onClick={()=>{
        navigate('/signup')
      }} >Want to create a new Account ? <span className='text-[#20c7ff] ' disabled={loading}>{loading? "Loading...":"Sign up"}</span></p>
     
        </form>
      </div>
    </div>
  );
}

export default Login;
