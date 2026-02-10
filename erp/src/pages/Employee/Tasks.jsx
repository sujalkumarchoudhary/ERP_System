// import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaCheckCircle,
  FaClock,
  FaTasks,
  FaUserTie,

} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { FileText } from "lucide-react";
import { LayoutGrid, List } from "lucide-react";



export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const hasFetched = useRef(false);

  /* ================= HELPERS ================= */
  const removeTimezone = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // 👈 THIS IS THE KEY
  };



  /* ================= STATUS LABEL ================= */
  const statusLabel = (status) => {
    if (status === "assigned") return "Assigned";
    if (status === "accepted") return "In Progress";
    if (status === "completed") return "Completed";
    return status;
  };


  /* ================= FETCH MY TASKS ================= */
  // useEffect(() => {
  //   fetchMyTasks();
  // }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchMyTasks();
  }, []);


  const fetchMyTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/my");
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks error", error);
    }
  };


  /* ================= VIEW MODE ================= */
  const [viewMode, setViewMode] = useState("grid");



  /* ================= ACCEPT TASK ================= */
  const acceptTask = async (taskId) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/accept`);
      fetchMyTasks();
    } catch (error) {
      console.error("Accept task error", error);
    }
  };

  /* ================= COMPLETE TASK ================= */
  const completeTask = async (taskId) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/complete`);
      fetchMyTasks();
    } catch (error) {
      console.error("Complete task error", error);
    }
  };

  return (
    <div className=" p-6 bg-blue-50 w-full min-h-screen">
      {/* HEADER */}
      <div className="">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FaTasks /> My Assigned Tasks
        </h1>
        <p className="text-sm text-gray-500">
          Tasks assigned by admin
        </p>

        <div className="flex flex-col items-end gap-3">

          <div className="flex items-center bg-white rounded-lg shadow-sm p-1">

            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition
        ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              <List size={18} />
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition
        ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              <LayoutGrid size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500 mt-6">
          No tasks assigned yet
        </div>
      ) : (
        <>
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-4 gap-4 mt-6">

              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-2xl shadow-sm p-5 space-y-4
            hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >

                  {/* TOP BAR */}
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                ${task.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"}`}>
                      {task.priority}
                    </span>

                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {task.title}
                    </span>
                  </div>

                  {/* MAIN TEXT */}
                  <h2 className="font-semibold text-gray-800 leading-snug">
                    {task.description}
                  </h2>

                  {/* INFO */}
                  <div className="text-sm text-gray-500 space-y-2">

                    <div className="flex items-center gap-2">
                      <FileText size={15} />
                      {task.description}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUserTie /> Assigned to you
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <FaClock />
                      Start: {removeTimezone(task.startDate)} — End: {removeTimezone(task.endDate)}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <FaClock />
                      Review: {removeTimezone(task.CodeReviewMeeting)} — Prep: {removeTimezone(task.ClientPresentationPrep)}
                    </div>

                  </div>

                  {/* STATUS */}
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium
              ${task.status === "assigned"
                      ? "bg-blue-100 text-blue-600"
                      : task.status === "accepted"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"}`}>
                    {statusLabel(task.status)}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex gap-3 pt-2">

                    {task.status === "assigned" && (
                      <button
                        onClick={() => acceptTask(task._id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                      >
                        Accept Task
                      </button>
                    )}

                    {task.status === "accepted" && (
                      <button
                        onClick={() => completeTask(task._id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2"
                      >
                        <FaCheckCircle /> Mark Completed
                      </button>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">

              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Priority</th>
                    <th className="p-3 text-left">Start</th>
                    <th className="p-3 text-left">End</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id} className=" hover:bg-gray-50">

                      <td className="p-3 font-medium">{task.title}</td>

                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs
                    ${task.priority === "High" ? "bg-red-100 text-red-600" :
                            task.priority === "Medium" ? "bg-yellow-100 text-yellow-600" :
                              "bg-green-100 text-green-600"}`}>
                          {task.priority}
                        </span>
                      </td>

                      <td className="p-3">{removeTimezone(task.startDate)}</td>
                      <td className="p-3">{removeTimezone(task.endDate)}</td>

                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs
                    ${task.status === "assigned" ? "bg-blue-100 text-blue-600" :
                            task.status === "accepted" ? "bg-yellow-100 text-yellow-600" :
                              "bg-green-100 text-green-600"}`}>
                          {statusLabel(task.status)}
                        </span>
                      </td>

                      <td className="p-3 space-x-2">
                        {task.status === "assigned" && (
                          <button
                            onClick={() => acceptTask(task._id)}
                            className="text-indigo-600 hover:underline"
                          >
                            Accept
                          </button>
                        )}

                        {task.status === "accepted" && (
                          <button
                            onClick={() => completeTask(task._id)}
                            className="text-green-600 hover:underline"
                          >
                            Complete
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
        </>
      )}

    </div>
  );
}
