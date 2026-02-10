
// new updated code

import { Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { logout } from "../utils/auth";

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee"));

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* ✅ TOPBAR – FULL WIDTH */}
      <Topbar />

      {/* ✅ BODY */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-64 bg-gray-50 text-black flex flex-col">

          <nav className="flex-1 p-3 space-y-2 text-sm">
            <Sidebar />
          </nav>

        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet context={{ employee }} />
        </main>

      </div>
    </div>
  );
}

