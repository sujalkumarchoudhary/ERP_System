import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_token");
  const employeeToken = localStorage.getItem("employee_token");

  let tokenToSend = null;

  try {
    // Prefer admin token for admin-only APIs
    if (
      config.url.startsWith("/dashboard") ||
      config.url.startsWith("/employees") ||
      config.url.startsWith("/departments") ||
      config.url.startsWith("/announcements") ||
      config.url.startsWith("/inventory") ||
      config.url.startsWith("/sales") ||
      config.url.startsWith("/attendance") ||
      (config.url.startsWith("/leaves") && config.method === "get")
    ) {
      tokenToSend = adminToken;
    } else {
      tokenToSend = employeeToken;
    }

    // Fallback
    if (!tokenToSend) {
      tokenToSend = adminToken || employeeToken;
    }

    if (tokenToSend) {
      config.headers.Authorization = `Bearer ${tokenToSend}`;
    }
  } catch (err) {
    console.error("Token error", err);
  }

  return config;
});

export default axiosInstance;
