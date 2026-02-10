import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTie,
} from "react-icons/fa";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/auth/employee/login", {
        email,
        password,
      });

      // Clear old tokens
      localStorage.removeItem("admin_token");
      localStorage.removeItem("employee_token");
      localStorage.removeItem("role");
      localStorage.setItem("employee_token", res.data.token);
      localStorage.setItem("role", "employee");


      // ✅ DIRECT NAVIGATE (kyunki ye employee login hi hai)
      navigate("/employee/profile");

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };


  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#9b6b6f]/10 flex items-center justify-center text-[#9b6b6f]">
              <FaUserTie />
            </div>
            <h1 className="text-3xl font-bold">Employee Login</h1>
          </div>

          <p className="text-gray-500 mb-8">
            Login with your employee credentials
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b6b6f]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b6b6f]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#9b6b6f] text-white font-semibold hover:bg-[#87585c] transition"
            >
              Login
            </button>
          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-linear-to-b from-[#c48b8f] to-[#f3d1a5]">
          <img
            src="https://plus.unsplash.com/premium_photo-1661963899181-3adc0a644f7b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG9mZmljZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"
            alt="Employee Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
