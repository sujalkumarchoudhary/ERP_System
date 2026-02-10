import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function StatsCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Stats error:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Employees" value="—" />
        <Card title="Total Departments" value="—" /> {/* NEW */}
        <Card title="Total Stock" value="—" />
        <Card title="Revenue" value="—" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card title="Total Employees" value={stats.totalEmployees} />
      <Card title="Total Departments" value={stats.totalDepartments} /> {/* ✅ */}
      <Card title="Total Stock" value={stats.totalStock} />
      <Card title="Total Revenue" value={`₹${stats.totalRevenue}`} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
    </div>
  );
}
