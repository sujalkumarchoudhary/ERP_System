import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FileText } from "lucide-react";
import {
  FaCheckCircle,
  FaClock,
  FaTasks,
  FaUserTie,

} from "react-icons/fa";
import { LayoutGrid, List } from "lucide-react";
import { ArrowUpDown, Filter } from "lucide-react";



export default function AssignTask() {
  /* ================= STATE ================= */
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const hasFetched = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    employeeId: "",
    departmentId: "",
    employeeName: "",
    startDate: "",
    endDate: "",
  });


  /* ================= VIEW MODE ================= */
  const [viewMode, setViewMode] = useState("grid"); // grid | list



  /* ================= SORTING ================= */
  const [selectedDept, setSelectedDept] = useState("all");
  const filteredTasks =
    selectedDept === "all"
      ? tasks
      : tasks.filter(
        t =>
          t.departmentName === selectedDept ||
          t.department?.name === selectedDept
      );





  /* ================= HELPERS ================= */
  const removeTimezone = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // 👈 THIS IS THE KEY
  };

  /* ================= HELPERS ================= */
  const statusLabel = (status) => {
    if (status === "assigned") return "Assigned";
    if (status === "accepted") return "In Progress";
    if (status === "completed") return "Completed";
    return status;
  };

  /* ================= FETCH ================= */
  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/admin");
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks error", err.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Fetch departments error", err.message);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchTasks();
    fetchDepartments();
  }, []);

  /* ================= ASSIGN TASK ================= */
  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.employeeId ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const { employeeName, ...cleanData } = formData;

      const payload = {
        ...cleanData,
        startDate: new Date(cleanData.startDate),
        endDate: new Date(cleanData.endDate),
      };

      await axiosInstance.post("/tasks", payload);
      await fetchTasks();

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        priority: "Low",
        employeeId: "",
        employeeName: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Assign task error", err.message);
    }
  };

  /* ================= DELETE TASK ================= */
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axiosInstance.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Delete task error", err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">

        {/* LEFT TITLE */}
        <h1 className="text-2xl font-semibold">
          Assign Tasks (Admin)
        </h1>

        {/* RIGHT SIDE STACK */}
        <div className="flex flex-col items-end gap-3">

          {/* Assign button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-sky-800 text-white px-4 py-2 rounded-lg 
      flex items-center gap-2 hover:bg-sky-900 transition"
          >
            <FaPlus /> Assign Task
          </button>

          {/* Controls row under button */}
          <div className="flex items-center gap-4">

            {/* Toggle */}
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

            {/* Sort */}
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition">
              <ArrowUpDown size={16} />
              Sort
            </button>

            {/* Filter with dropdown */}
            <div className="relative">

              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="flex items-center gap-2 border rounded-lg px-3 py-2 
          text-sm bg-white shadow-sm cursor-pointer"
              >
                <option value="all">All Departments</option>

                {departments.map(dept => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

      </div>








      {/* TASK LIST (ACTIVE + HISTORY) */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned</p>
      ) : (
        <>
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full w-full">

              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-2xl shadow-sm p-4 space-y-3 
            hover:shadow-lg hover:-translate-y-1 transition-all duration-300 
            cursor-pointer relative group"
                >

                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      {task.priority}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
              text-gray-400 hover:text-red-500 transition"
                  >
                    <FaTrash size={14} />
                  </button>

                  <h2 className="font-semibold text-gray-800 leading-snug">
                    {task.description}
                  </h2>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Start: {removeTimezone(task.startDate)}</p>
                    <p>End: {removeTimezone(task.endDate)}</p>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Review: {removeTimezone(task.CodeReviewMeeting)}</p>
                    <p>Prep: {removeTimezone(task.ClientPresentationPrep)}</p>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full
                  ${task.status === "assigned" ? "w-1/4 bg-blue-500" :
                          task.status === "accepted" ? "w-2/3 bg-orange-500" :
                            "w-full bg-green-500"}`}
                    />
                  </div>

                  <div className="pt-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                ${task.status === "assigned" ? "bg-blue-100 text-blue-600" :
                        task.status === "accepted" ? "bg-orange-100 text-orange-600" :
                          "bg-green-100 text-green-600"}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="border-t pt-2"></div>

                  {/* Employee name from backend */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaUserTie className="text-gray-400" />

                    <span>
                      {task.employeeName || task.employee?.name || "Not assigned"}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="bg-white rounded-xl shadow overflow-hidden">

              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Employee</th>
                    <th className="p-3 text-left">Priority</th>
                    <th className="p-3 text-left">Start</th>
                    <th className="p-3 text-left">End</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task._id} className="hover:bg-gray-50">

                      <td className="p-3 font-medium">
                        {task.title}
                      </td>

                      {/* Employee name from backend */}
                      <td className="p-3 text-gray-600">
                        {task.employeeName || task.employee?.name || "Not assigned"}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs
                ${task.priority === "High" ? "bg-red-100 text-red-600" :
                            task.priority === "Medium" ? "bg-yellow-100 text-yellow-600" :
                              "bg-green-100 text-green-600"}`}>
                          {task.priority}
                        </span>
                      </td>

                      <td className="p-3">
                        {removeTimezone(task.startDate)}
                      </td>

                      <td className="p-3">
                        {removeTimezone(task.endDate)}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs
                ${task.status === "assigned" ? "bg-blue-100 text-blue-600" :
                            task.status === "accepted" ? "bg-orange-100 text-orange-600" :
                              "bg-green-100 text-green-600"}`}>
                          {task.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}

        </>
      )}


      {/* ASSIGN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-170 max-h-[90vh] overflow-y-auto
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-100
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400">
            <h2 className="text-lg font-semibold mb-4">
              Assign New Task
            </h2>

            <form onSubmit={handleAssignTask} className="space-y-4">

              {/* Task Title */}
              <div>
                <label className="text-sm font-medium">Task Title</label>
                <input
                  placeholder="Enter task title"
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  } />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Task Description</label>
                <textarea
                  placeholder="Enter task description"
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  } />
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium">Department</label>
                <select
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={selectedDepartment}
                  onChange={async (e) => {
                    const deptId = e.target.value;
                    setSelectedDepartment(deptId);

                    if (!deptId) {
                      setEmployees([]);
                      return;
                    }

                    const res = await axiosInstance.get(
                      `/departments/${deptId}/employees`
                    );
                    setEmployees(res.data);

                    setFormData({
                      ...formData,
                      departmentId: deptId,   // ✅ SEND DEPT IN TASK
                      employeeId: "",
                      employeeName: "",
                    });
                  }}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee */}
              <div>
                <label className="text-sm font-medium">Employee</label>
                <select
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={formData.employeeId}
                  onChange={(e) => {
                    const emp = employees.find(
                      (x) => x._id === e.target.value
                    );

                    if (!emp) return;

                    setFormData({
                      ...formData,
                      employeeId: emp._id,
                      employeeName: emp.name,
                    });
                  }}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full mt-1"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    } />
                </div>

                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full mt-1"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    } />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="text-sm font-medium">Code Review Meeting</label>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full mt-1"
                    value={formData.CodeReviewMeeting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        CodeReviewMeeting: e.target.value,
                      })
                    } />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Client Presentation Prep
                  </label>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full mt-1"
                    value={formData.ClientPresentationPrep}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ClientPresentationPrep: e.target.value,
                      })
                    } />
                </div>
              </div>



              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-800 text-white px-4 py-2 rounded cursor-pointer">
                  Assign
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
