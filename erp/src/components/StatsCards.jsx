import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function StatsCards() {
  const [pendingTasks, setPendingTasks] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState("—");

  /* ================= FETCH BACKEND STATS ================= */
  useEffect(() => {
    fetchPendingTasks();
    fetchLeaveBalance();
  }, []);

  // 🔹 Pending Tasks (from backend)
  const fetchPendingTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/my");
      const pending = res.data.filter(
        (t) => t.status === "assigned" || t.status === "Assigned"
      ).length;

      setPendingTasks(pending);
    } catch (error) {
      console.error("Pending tasks error", error);
    }
  };

  // 🔹 Leave Balance (calculated from backend)
  const fetchLeaveBalance = async () => {
    try {
      const res = await axiosInstance.get("/leaves/my");

      const approvedLeaves = res.data.filter(
        (l) => l.status === "Approved"
      ).length;

      // 🔧 Example logic: total 12 leaves per year
      const TOTAL_LEAVES = 12;
      setLeaveBalance(`${TOTAL_LEAVES - approvedLeaves} Days`);
    } catch (error) {
      console.error("Leave balance error", error);
    }
  };

  /* ================= CARDS ================= */
  const cards = [
    {
      title: "Pending Tasks",
      value: pendingTasks,
      color: "bg-white",
    },
    {
      title: "Today's Attendance",
      value: "Present", // ❌ backend nahi hai → static
      color: "bg-white",
    },
    {
      title: "Leave Balance",
      value: leaveBalance, // ✅ backend se
      color: "bg-white",
    },
    {
      title: "Upcoming Holiday",
      value: "Diwali - 4 Nov", // ❌ backend nahi hai → static
      color: "bg-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} text-black p-6 rounded-xl shadow`}
        >
          <p className="text-sm">{card.title}</p>
          <h2 className="text-2xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
