import axios from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.removeItem("admin_token");
      localStorage.removeItem("employee_token");
      localStorage.removeItem("role");
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("role", "admin");

      if (res.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("❌ Email or password is incorrect");
      } else {
        setError("❌ Server error, try later");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT */}
        <div className="p-10 md:p-14">
          <h1 className="text-3xl font-bold mb-2">Login Admin</h1>
          <p className="text-gray-500 mb-8">
            Enter your credentials to access your account
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

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-linear-to-b from-[#c48b8f] to-[#f3d1a5]">
          <img
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlc3xlbnwwfHwwfHx8MA%3D%3D"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

