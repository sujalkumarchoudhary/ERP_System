import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");

  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    fetchAnnouncements();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await axiosInstance.get("/departments");
    setDepartments(res.data);
  };



  /* ================= FETCH ================= */
  // useEffect(() => {
  //   fetchAnnouncements();
  // }, []);

 const fetchAnnouncements = async () => {
  try {
    const res = await axiosInstance.get("/announcements");
    setAnnouncements(res.data);
  } catch (error) {
    console.error("Fetch announcements error", error);
  } 
};


  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!message || !departmentId) {
      alert("All fields required");
      return;
    }

    try {
      await axiosInstance.post("/announcements", {
        message,
        departmentId,
      });

      fetchAnnouncements();
      setShowModal(false);
      setMessage("");
      setDepartmentId("");
    } catch (error) {
      console.error(error);
    }
  };


  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete announcement?")) return;

    try {
      await axiosInstance.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Announcements (Admin)
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> New Announcement
        </button>
      </div>

      {/* LIST */}
      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow p-4 flex justify-between"
            >
              <div>
                <p className="text-sm text-gray-700">
                  {a.message}
                </p>

                {/* ✅ ADD HERE */}
                <p className="text-xs text-gray-500">
                  Department: {a.department?.name}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>


              <button
                onClick={() => handleDelete(a._id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="font-semibold text-lg mb-4">
              Create Announcement
            </h2>

            <textarea
              placeholder="Announcement message"
              rows="4"
              className="w-full border px-3 py-2 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <select
              className="w-full border px-3 py-2 rounded mb-3"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>


            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
