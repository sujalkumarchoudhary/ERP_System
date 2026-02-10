import { jwtDecode } from "jwt-decode";

// Get logged-in user (admin / employee)
export const getUser = () => {
  let token = null;

  const path = window.location.pathname;

  // Decide token by route
  if (path.startsWith("/employee")) {
    token = localStorage.getItem("employee_token");
  } else {
    token = localStorage.getItem("admin_token");
  }

  if (!token) return null;

  try {
    return jwtDecode(token); // { id, role, exp }
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

// Login check
export const isLoggedIn = () => {
  return (
    !!localStorage.getItem("admin_token") ||
    !!localStorage.getItem("employee_token")
  );
};

// Logout (both roles safe)
export const logout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("employee_token");
  window.location.href = "/";
};

