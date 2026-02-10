import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUserTie } from "react-icons/fa";

export default function LoginChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to ERP</h1>
          <p className="text-gray-500 mb-10">
            Please choose how you want to login
          </p>

          {/* Admin Login */}
          <button
            onClick={() => navigate("/admin-login")}
            className="flex items-center justify-center gap-3 w-full py-4 mb-4
                       rounded-xl bg-[#9b6b6f] text-white font-semibold
                       hover:bg-[#87585c] transition"
          >
            <FaUserShield />
            Admin Login
          </button>

          {/* Employee Login */}
          <button
            onClick={() => navigate("/employee-login")}
            className="flex items-center justify-center gap-3 w-full py-4
                       rounded-xl border border-gray-300 text-gray-700 font-semibold
                       hover:bg-gray-50 transition"
          >
            <FaUserTie />
            Employee Login
          </button>

          <p className="text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} ERP System
          </p>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-linear-to-b from-[#c48b8f] to-[#f3d1a5]">
          <img
            src="https://www.ergolink.com.au/theme/ergolinkcomau/assets/public/Image/blog/how-to-make-your-space-look-fun-yet-professional.jpg"
            alt="ERP Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
