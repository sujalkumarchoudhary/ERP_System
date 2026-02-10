import { useState } from "react";
import {
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaUserShield,
  FaTimes,
} from "react-icons/fa";

export default function DepartmentBoxes() {
  const [showModal, setShowModal] = useState(false);
  const [department, setDepartment] = useState("");

  const openForm = (dept) => {
    setDepartment(dept);
    setShowModal(true);
  };

  const closeForm = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* ====== BOXES ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Box
          title="Intern"
          icon={<FaUserGraduate />}
          color="bg-blue-500"
          onClick={() => openForm("Intern")}
        />
        <Box
          title="HR"
          icon={<FaUsers />}
          color="bg-green-500"
          onClick={() => openForm("HR")}
        />
        <Box
          title="Senior Manager"
          icon={<FaUserTie />}
          color="bg-purple-500"
          onClick={() => openForm("Senior Manager")}
        />
        <Box
          title="Admin"
          icon={<FaUserShield />}
          color="bg-pink-500"
          onClick={() => openForm("Admin")}
        />
      </div>

      {/* ====== POPUP FORM ====== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
            <button
              onClick={closeForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Add {department} Employee
            </h2>

            <form className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="border p-2 rounded"
              />

              {/* Auto Department */}
              <input
                type="text"
                value={department}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />

              <input
                type="text"
                placeholder="Designation"
                className="border p-2 rounded"
              />

              <input
                type="date"
                className="border p-2 rounded"
              />

              <select className="border p-2 rounded">
                <option value="">Role / Access Level</option>
                <option>Employee</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>

              <select className="border p-2 rounded">
                <option value="">Employee Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <button
                type="button"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ===== BOX COMPONENT ===== */
function Box({ title, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${color} text-white rounded-xl p-6 cursor-pointer hover:scale-105 transition`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm opacity-90">Click to manage {title}</p>
    </div>
  );
}
