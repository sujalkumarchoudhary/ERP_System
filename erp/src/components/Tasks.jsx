import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function TasksCard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/my");
      setTasks(res.data.slice(0, 3)); // sirf 3 tasks
    } catch (error) {
      console.error("Fetch tasks error", error);
    }
  };

  // 🔹 helper for due label
  const getDueLabel = (endDate) => {
    const today = new Date();
    const due = new Date(endDate);
    const diff =
      Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff <= 0) return "Due Today";
    if (diff === 1) return "Due Tomorrow";
    return `Due in ${diff} Days`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">My Tasks</h2>
        <Link
          to="/employee/tasks"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">
          No tasks assigned
        </p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <p className="text-sm font-medium">
                  {task.title}
                </p>
              </div>

              <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded">
                Last Date: {getDueLabel(task.endDate)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Button */}
      <div className="mt-6 text-center">
        <Link
          to="/employee/tasks"
          className="inline-block bg-blue-100 text-blue-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-200"
        >
          View All
        </Link>
      </div>
    </div>
  );
}
