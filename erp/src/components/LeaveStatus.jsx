import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function LeaveStatusCard() {
  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  /* ================= FETCH LEAVE STATUS ================= */
  useEffect(() => {
    fetchLeaveStats();
  }, []);

  const fetchLeaveStats = async () => {
    try {
      const res = await axiosInstance.get("/leaves/my");

      const leaves = res.data;

      const approved = leaves.filter(
        (l) => l.status === "Approved"
      ).length;

      const pending = leaves.filter(
        (l) => l.status === "Pending"
      ).length;

      const rejected = leaves.filter(
        (l) => l.status === "Rejected"
      ).length;

      setStats({ approved, pending, rejected });
    } catch (error) {
      console.error("Fetch leave stats error", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm">Leave Status</h2>

        <div className="flex gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Status Boxes */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {/* Approved */}
        <div className="bg-green-50 rounded-lg p-3 shadow-sm">
          <h3 className="text-2xl font-bold text-green-600">
            {stats.approved}
          </h3>
          <p className="text-xs text-green-700 font-medium">
            Approved
          </p>
        </div>

        {/* Pending */}
        <div className="bg-blue-50 rounded-lg p-3 shadow-sm">
          <h3 className="text-2xl font-bold text-blue-600">
            {stats.pending}
          </h3>
          <p className="text-xs text-blue-700 font-medium">
            Pending
          </p>
        </div>

        {/* Rejected */}
        <div className="bg-red-50 rounded-lg p-3 shadow-sm">
          <h3 className="text-2xl font-bold text-red-600">
            {stats.rejected}
          </h3>
          <p className="text-xs text-red-700 font-medium">
            Rejected
          </p>
        </div>
      </div>
    </div>
  );
}
