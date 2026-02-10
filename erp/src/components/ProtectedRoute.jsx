import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

