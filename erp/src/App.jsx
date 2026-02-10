import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC
import LoginChoice from "./pages/LoginChoice";
import Login from "./pages/Login";

// Admin components
import MainScreen from "./pages/Admin/MainScreen";
import Employees from "./pages/Admin/Employees";
import Inventory from "./pages/Admin/Inventory";
import Sales from "./pages/Admin/Sales";
import LeaveRequests from "./pages/Admin/LeaveRequests";
import AssignTasks from "./pages/Admin/AssignTasks";
import Departments from "./pages/Admin/Departments";
import Announcements from "./pages/Admin/Announcements";
import AttendanceAdmin from "./pages/Admin/AttendanceAdmin";

// Employee components
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import Profile from "./pages/Employee/Profile";
import Tasks from "./pages/Employee/Tasks";
import Leave from "./pages/Employee/Leave";
import Attendance from "./pages/Employee/Attendance";

import DashboardLayout from "./layouts/DashboardLayout";
import AdTopbar from "./components/AdTopbar";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeLayout from "./layouts/EmployeeLayout";

function App() {
  return (
    <Routes>
      {/* ===== LOGIN CHOICE ===== */}
      <Route path="/" element={<LoginChoice />} />

      {/* ===== PUBLIC ===== */}
      <Route path="/admin-login" element={<Login />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />

      {/* ===== UNAUTHORIZED ===== */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
              <p className="text-gray-600 text-lg">Access Denied. You don't have permission to view this page.</p>
            </div>
          </div>
        }
      />

      {/* ===== ADMIN ROUTES ===== */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          element={
            <>
              <AdTopbar />
              <DashboardLayout />
            </>
          }
        >
          <Route path="/dashboard" element={<MainScreen />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/leaves" element={<LeaveRequests />} />
          <Route path="/assign-tasks" element={<AssignTasks />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/attendance-admin" element={<AttendanceAdmin />} />
        </Route>
      </Route>

      {/* ===== EMPLOYEE ROUTES ===== */}
      <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="leave" element={<Leave />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

