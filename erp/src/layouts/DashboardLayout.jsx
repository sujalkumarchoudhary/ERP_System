import { Link, Outlet } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaBoxes,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserTie,
  FaTasks,
} from "react-icons/fa";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";
import { Megaphone } from "lucide-react";


export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-50 text-black flex flex-col">
        {/* <img src="src/assets/Images/p4.jpg" alt="logo" className="w-10 h-10 mt-4 ml-9 rounded-full" />
        <div className="pl-3">Fule IT Online</div>
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div> */}
        <div className="mb-3 text-center">
          <h1 className="font-semibold text-xl text-gray-800 dark:text-black">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-3 space-y-2 text-sm">
          <NavItem to="/dashboard" icon={<FaChartLine />} text="Dashboard" />
          <NavItem to="/employees" icon={<FaUsers />} text="Employees" />
          <NavItem to="/inventory" icon={<FaBoxes />} text="Inventory" />
          <NavItem to="/sales" icon={<FaShoppingCart />} text="Sales" />
          <NavItem
            to="/leaves"
            icon={<FaCalendarCheck />}
            text="Leave Requests"
          />
          <NavItem to="/assign-tasks" icon={<FaTasks />} text="Assign Tasks" />
          <NavItem to="/departments" icon={<FaUserTie />} text="Departments" />
          <NavItem
            to="/announcements"
            icon={<Megaphone size={18} />}
            text="Announcements"
          />
          <NavItem
            to="/attendance-admin"
            icon={<FaChartLine />}
            text="Attendance"
          />

        </nav>


      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 hover:text-black transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
