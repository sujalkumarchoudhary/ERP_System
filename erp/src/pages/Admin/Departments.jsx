import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";

export default function Departments() {
  /* ================= STATE ================= */

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // popup states
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");


  // search state
  const [searchTerm, setSearchTerm] = useState("");


  /* ================= FETCH DEPARTMENTS ================= */

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get("/departments");
        setDepartments(res.data);
      } catch (error) {
        console.error("Fetch departments error", error);
      }
    };

    fetchDepartments();
  }, []);

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  /* ================= UPDATE FORM HANDLERS ================= */
  const handleUpdateChange = (e) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  };
  /* ================= CONFIRM UPDATE DEPARTMENT ================= */
  const confirmUpdateDepartment = async () => {
    try {
      const res = await axiosInstance.put(
        `/departments/${updateId}`,
        updateData
      );

      setDepartments((prev) =>
        prev.map((d) =>
          d._id === updateId ? res.data : d
        )
      );

      setShowUpdateModal(false);
      setUpdateId(null);
    } catch (error) {
      console.error("Update department error", error);
    }
  };



  /* ================= CREATE DEPARTMENT ================= */

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) return;

    try {
      const res = await axiosInstance.post("/departments", formData);
      setDepartments([res.data, ...departments]);

      setFormData({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Create department error", error);
    }
  };

  /* ================= OPEN POPUP ================= */

  // const openDepartment = async (deptName) => {
  //   try {
  //     const res = await axiosInstance.get(
  //       `/departments/${deptName}/employees`
  //     );

  //     setEmployees(res.data);
  //     setSelectedDept(deptName);
  //     setShowModal(true);
  //     setFilterStatus("All");
  //   } catch (error) {
  //     console.error("Fetch department employees error", error);
  //   }
  // };

  const openDepartment = async (deptId, deptName) => {
    try {
      const res = await axiosInstance.get(
        `/departments/${deptId}/employees`
      );

      setEmployees(res.data);
      setSelectedDept(deptName); // only for heading
      setShowModal(true);
      setFilterStatus("All");
    } catch (error) {
      console.error("Fetch department employees error", error);
    }
  };


  /* ================= FILTER ================= */

  // const filteredEmployees = employees.filter((emp) => {
  //   if (filterStatus === "All") return true;
  //   return emp.status === filterStatus;
  // });

  const filteredEmployees = employees.filter((emp) => {
    const matchesStatus =
      filterStatus === "All" || emp.status === filterStatus;

    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });


  /* ================= PAGINATION ================= */
  const [popupPage, setPopupPage] = useState(1);
  const popupPerPage = 4;

  const totalPages = Math.ceil(filteredEmployees.length / popupPerPage);

  const paginatedEmployees = filteredEmployees.slice(
    (popupPage - 1) * popupPerPage,
    popupPage * popupPerPage
  );




  /* ================= DELETE DEPARTMENT ================= */


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteDepartment = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDeleteDepartment = async () => {
    try {
      await axiosInstance.delete(`/departments/${deleteId}`);
      setDepartments((prev) => prev.filter((d) => d._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Delete department error", error);
    }
  };



  /* ================= EDIT DEPARTMENT (BASIC) ================= */

  // update popup states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
  });


  const handleEditDepartment = (dept) => {
    setUpdateId(dept._id);
    setUpdateData({
      name: dept.name,
      description: dept.description,
    });
    setShowUpdateModal(true);
  };


  return (
    <div className="p-6">

      {/* ===== PAGE TITLE ===== */}
      <h1 className="text-2xl font-bold">Departments</h1>
      <p className="text-gray-600 mb-6">
        Create and manage departments
      </p>

      {/* ===== FORM ===== */}
      <div className="flex gap-5">
        <input
          type="text"
          name="name"
          placeholder="Department Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <textarea
          name="description"
          placeholder="Department Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-sky-800 text-white h-12 px-6 rounded-xl"
        >
          Save
        </button>
      </div>

      {/* ===== DEPARTMENT BOXES ===== */}
      <div className="flex flex-wrap gap-4 mt-8">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="relative rounded-lg p-4 shadow-sm w-55 h-60 bg-orange-200"
          >
            {/* ACTION BUTTONS */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDepartment(dept);
                }}
                className="bg-blue-500 text-white p-1 rounded"
              >
                <FaEdit size={14} />
              </button>





              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDepartment(dept._id);
                }}
                className="bg-red-500 text-white p-1 rounded"
              >
                <FaTrash size={14} />
              </button> */}

              <button onClick={() => handleDeleteDepartment(dept._id)} className="bg-red-500 text-white p-1 rounded"
              >
                <FaTrash size={14} />
              </button>

            </div>

            {/* CLICK AREA */}
            <div className="cursor-pointer"
            // onClick={() => openDepartment(dept.name)}
            // onClick={() => openDepartment(dept._id, dept.name)}


            >
              {/* ✅ ENTER BUTTON (YAHI ADD KARNA HAI) */}
              <button
                onClick={() => openDepartment(dept._id, dept.name)}
                className="absolute bottom-3 left-3 bg-sky-700 text-white text-sm px-3 py-1 rounded cursor-pointer"
              >
                Enter
              </button>
              <h3 className="text-lg font-semibold">
                {dept.name}
              </h3>
              <p className="text-gray-600 text-sm mt-5">
                {dept.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= POPUP ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">

            {/* SEARCH */}
            <div className="flex justify-center mb-2 " >
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-4 py-2 rounded w-1/2 text-sm"
              />
            </div>


            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-2">
              {selectedDept} Employees
            </h2>


            {/* COUNTS + FILTER */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 text-sm">
                <span>Total: {employees.length}</span>
                <span className="text-green-600">
                  Active: {employees.filter(e => e.status === "Active").length}
                </span>
                <span className="text-red-600">
                  Inactive: {employees.filter(e => e.status !== "Active").length}
                </span>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* TABLE */}
            {filteredEmployees.length === 0 ? (
              <p className="text-sm text-gray-500">No employees found</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedEmployees.map((emp, index) => (
                      <tr key={emp._id} className="hover:bg-gray-50">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{emp.name}</td>
                        <td className="p-2">{emp.email}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${emp.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                              }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <button
                    disabled={popupPage === 1}
                    onClick={() => setPopupPage(popupPage - 1)}
                    className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
                  >
                    Previous
                  </button>

                  <span>
                    Page {popupPage} of {totalPages || 1}
                  </span>

                  <button
                    disabled={popupPage === totalPages}
                    onClick={() => setPopupPage(popupPage + 1)}
                    className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
                  >
                    Next
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}


      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[20%] max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-3">
              Confirm Delete
            </h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this department?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteDepartment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE DEPARTMENT MODAL */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[25%] max-w-md shadow-lg relative">

            {/* Close */}
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Update Department
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={updateData.name}
                onChange={handleUpdateChange}
                placeholder="Department Name"
                className="border p-2 rounded w-full"
              />

              <textarea
                name="description"
                value={updateData.description}
                onChange={handleUpdateChange}
                placeholder="Department Description"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={confirmUpdateDepartment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

