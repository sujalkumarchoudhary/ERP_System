import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaTasks,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa";

export default function EmployeeSidebar() {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/employee/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "My Profile",
      path: "/employee/profile",
      icon: <FaUser />,
    },
    {
      name: "My Tasks",
      path: "/employee/tasks",
      icon: <FaTasks />,
    },
    {
      name: "Leave Requests",
      path: "/employee/leave",
      icon: <FaCalendarAlt />,
    },

    {
      name: "Attendance",
      path: "/employee/attendance",
      icon: <FaClipboardCheck />,
    }
  ];

  return (
    <div className="b">
      <h1 className="text-black text-xl font-semibold mb-6 text-center">
        Employee Panel
      </h1>

      <div className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm
              ${
                location.pathname === item.path
                  ? "bg-gray-200 text-black font-semibold"
                  : "text-black hover:bg-gray-200 hover:text-black"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
