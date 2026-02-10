import { useState, useEffect, useRef } from "react";
import { Bell, User, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../utils/auth";




export default function Topbar() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let employeeName = "Employee";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      employeeName = decoded.name || "Employee";
    } catch (err) {
      console.error("Invalid token");
    }
  }
  const user = getUser();



  // Dark mode
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full h-14 sticky top-0 z-50 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b dark:border-gray-700">

      {/* LEFT */}
      <div className="flex gap-2 items-center">
        <img
          src="src/assets/Images/p4.jpg"
          alt="logo"
          className="w-10 h-10 rounded-full"
        />
        <p className="font-semibold text-lg text-gray-800 dark:text-white">
          Fuel IT Online
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Dark / Light */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {dark ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-gray-700" />
          )}
        </button>

        {/* Notification */}
        <div className="relative cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={18} className="text-gray-700 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* USER DROPDOWN */}
        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User size={18} className="text-gray-700 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:block">
              {user?.name || "Employee"}
            </span>


          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-5 w-64 bg-white dark:bg-gray-100 dark:border-gray-700 rounded-xl shadow-lg p-4">

              {/* ===== CENTER PROFILE ICON ===== */}
              <div className="flex flex-col items-center gap-2 mb-3">

                {/* CIRCULAR IMAGE / ICON */}
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <User size={32} />
                  {/* OR image
        <img
          src="https://i.pravatar.cc/150"
          className="w-full h-full rounded-full object-cover"
        />
        */}
                </div>

                {/* NAME */}
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Employee"}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.role}
                </p>
              </div>

              {/* DIVIDER */}
              <div className="border-t my-2"></div>

              {/* ACTIONS */}
              <button
                onClick={() => {
                  navigate("/employee/profile");
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer"
              >
                👤 My Profile
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-500 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                🚪 Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
