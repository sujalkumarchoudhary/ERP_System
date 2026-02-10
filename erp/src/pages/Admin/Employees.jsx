import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // ✅ BACKEND CONNECT

export default function Employees() {
  /* ================= DATA ================= */

  const [employees, setEmployees] = useState([]); // ✅ backend se aayega

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(""); // add | edit
  const [current, setCurrent] = useState(null);

  const [departments, setDepartments] = useState([]);

  const [errors, setErrors] = useState({});



  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const emptyForm = {
    name: "",
    email: "",
    phone: "",

    role: "",
    designation: "",
    department: "",

    status: "Select Status",
    password: "",
    joiningDate: "",

    // personal details
    fatherName: "",
    motherName: "",
    gender: "",
    bloodGroup: "",
    dob: "",
    maritalStatus: "",

    nationality: "",
    alternatePhone: "",
    alternateEmail: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    photo: "",
  };




  const [formData, setFormData] = useState(emptyForm);

  /* ================= FETCH EMPLOYEES ================= */



  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Fetch employees error", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ================= FORM VALIDATION ================= */

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // Status
    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    // Department
    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    // Designation
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    // Role
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    // Joining Date
    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required";
    }

    // Father / Mother
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father name required";
    }
    if (!formData.motherName.trim()) {
      newErrors.motherName = "Mother name required";
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = "Gender required";
    }

    // Blood Group
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group required";
    }

    // DOB
    if (!formData.dob) {
      newErrors.dob = "Date of birth required";
    }

    // Marital Status
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = "Marital status required";
    }

    // Nationality
    // Nationality
    if (!formData.nationality.trim()) {
      newErrors.nationality = "Nationality is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.nationality)) {
      newErrors.nationality = "Nationality must contain only letters";
    }


    // Pincode (IMPORTANT)
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = "Address required";
    }

    // State / City
    if (!formData.state.trim()) {
      newErrors.state = "State required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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


  /* VIEW MODAL */
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  /* ================= GRAPH FILTERS ================= */

  const [graphDepartment, setGraphDepartment] = useState("All");
  const [graphStatus, setGraphStatus] = useState("All");

  const graphFilteredEmployees = employees.filter((e) => {
    // if (graphDepartment !== "All" && e.department !== graphDepartment)
    //   return false;


    if (
      graphDepartment !== "All" &&
      e.department?.name !== graphDepartment
    )
      return false;
    if (graphStatus !== "All" && e.status !== graphStatus)
      return false;
    return true;

  });

  /* ================= TABLE FILTER ================= */

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ================= GRAPH DATA ================= */

  const departmentData = departments.map((dept) => ({
    name: dept.name,
    // value: graphFilteredEmployees.filter(
    //   (e) => e.department === dept.name
    // ).length,
    value: graphFilteredEmployees.filter(
      (e) => e.department?.name === dept.name
    ).length,

  }));


  const statusData = [
    {
      name: "Active",
      value: graphFilteredEmployees.filter(
        (e) => e.status === "Active"
      ).length,
    },
    {
      name: "Inactive",
      value: graphFilteredEmployees.filter(
        (e) => e.status === "Inactive"
      ).length,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#6366f1"];

  /* ================= ACTIONS ================= */

  const openAdd = () => {
    setMode("add");
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setMode("edit");
    setCurrent(emp);

    setFormData({
      ...emptyForm, // ✅ pehle saare fields reset
      ...emp,       // ✅ fir DB ka data bharo
      department: emp.department?._id || "",


    });

    setShowModal(true);
  };


  const handleDelete = (emp) => {
    setCurrent(emp);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/employees/${current._id}`);
      setEmployees(employees.filter((e) => e._id !== current._id));
    } catch (error) {
      console.error("Delete error", error);
    }
    setShowDeleteModal(false);
  };




  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === "add") {
        await axiosInstance.post("/employees", formData);
      }

      if (mode === "edit") {
        await axiosInstance.put(`/employees/${current._id}`, formData);
      }

      await fetchEmployees();
      setShowModal(false);
    } catch (error) {
      console.error("Save error", error);
    }
  };



  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Employees</h1>
        <p className="text-sm text-gray-500">
          Manage employees and analytics
        </p>
      </div>

      {/* GRAPH FILTERS */}
      <div className="bg-white rounded-xl shadow p-4 flex gap-4">
        <select
          value={graphDepartment}
          onChange={(e) => setGraphDepartment(e.target.value)}
          className="shadow-md  px-3 py-2 rounded focus:outline-none focus:ring-0 focus:border-gray-300"
        >
          <option value="All">All Departments</option>

          {departments.map((dept) => (
            <option key={dept._id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>


        <select
          value={graphStatus}
          onChange={(e) => setGraphStatus(e.target.value)}
          className="shadow-md px-3 py-2 rounded focus:outline-none focus:ring-0 focus:border-gray-300"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold mb-4">
            Employees by Department
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold mb-4">
            Active vs Inactive
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={90} label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEARCH + ADD */}
      <div className="flex justify-between gap-4">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-1/3 border px-4 py-2 rounded-lg"
        />

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Add Employee
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedEmployees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="px-4 py-3 font-medium">{emp.name}</td>
                <td className="px-4 py-3">{emp.role}</td>
                <td className="px-4 py-3">
                  {emp.department?.name || "—"}
                </td>

                {/* <td className="px-4 py-3">{emp.department}</td> */}
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${emp.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                    }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setViewEmployee(emp);
                      setShowViewModal(true);
                    }}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => openEdit(emp)}
                    className="bg-indigo-500 text-white p-2 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(emp)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded">
            Previous
          </button>

          <span>Page {page} of {totalPages}</span>

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded">
            Next
          </button>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-6xl rounded-xl relative flex max-h-[90vh]">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10"
            >
              <FaTimes />
            </button>

            {/* ================= LEFT PHOTO UPLOADER ================= */}
            <div className="w-1/3 bg-gray-100 flex flex-col items-center justify-center p-5">

              {/* Preview */}
              <div className="w-40 h-50 rounded-md overflow-hidden border mb-4 flex items-center justify-center bg-white">
                {formData.photo ? (
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Employee"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm text-center">
                    No Photo
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="cursor-pointer flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded">
                <span className="text-lg"></span>
                <FaUpload />Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.files[0] })
                  }
                />
              </label>

              <p className="text-xs text-gray-500 mt-2 text-center">
                JPG, PNG allowed
              </p>
            </div>

            {/* ================= RIGHT FORM (SCROLL) ================= */}
            <div className="w-2/3 p-6 overflow-y-auto">

              <h2 className="text-lg font-semibold mb-4 capitalize">
                {mode} Employee
              </h2>

              <form onSubmit={handleSave} className="space-y-2">

                <h3 className="font-semibold text-sm">Employee Information</h3>
                {/* ===== PERSONAL DETAILS ===== */}
                <div className="flex gap-4">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Name</h4>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />

                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Email</h4>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />

                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>


                <div className="flex gap-4 mt-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Status</h4>

                    <select
                      className={`w-full border px-3 py-2 rounded bg-white ${errors.status ? "border-red-500" : ""
                        }`}
                      value={formData.status}
                      onChange={(e) => {
                        setFormData({ ...formData, status: e.target.value });
                        setErrors({ ...errors, status: "" }); // clear error while selecting
                      }}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    {errors.status && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>


                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Phone</h4>

                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.phone ? "border-red-500" : ""
                        }`}
                      placeholder="Phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // only digits
                        setFormData({ ...formData, phone: value });
                        setErrors({ ...errors, phone: "" }); // clear error while typing
                      }}
                    />

                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                </div>

                <div className="">
                  <h4 className="text-xs font-medium mb-1">Password</h4>
                  <input
                    type="password"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}

                </div>
                {/* ===== JOB DETAILS ===== */}
                <h4 className="font-semibold text-sm mt-5 mb-2">Job Details</h4>

                <div className="flex gap-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Department</h4>
                    <select
                      className={`w-full border px-3 py-2 rounded bg-white ${errors.department ? "border-red-500" : ""
                        }`}
                      value={formData.department}
                      onChange={(e) => {
                        setFormData({ ...formData, department: e.target.value });
                        setErrors({ ...errors, department: "" });
                      }}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>

                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.department}
                      </p>
                    )}

                  </div>


                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Designation</h4>
                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.designation ? "border-red-500" : ""
                        }`}
                      placeholder="Designation"
                      value={formData.designation}
                      onChange={(e) => {
                        setFormData({ ...formData, designation: e.target.value });
                        setErrors({ ...errors, designation: "" });
                      }}
                    />

                    {errors.designation && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.designation}
                      </p>
                    )}

                  </div>
                </div>

                <div className="flex gap-5 mt-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Role</h4>
                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.role ? "border-red-500" : ""
                        }`}
                      placeholder="Role"
                      value={formData.role}
                      onChange={(e) => {
                        setFormData({ ...formData, role: e.target.value });
                        setErrors({ ...errors, role: "" });
                      }}
                    />

                    {errors.role && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.role}
                      </p>
                    )}

                  </div>

                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Joining Date</h4>
                    <input
                      type="date"
                      className={`w-full border px-3 py-2 rounded ${errors.joiningDate ? "border-red-500" : ""
                        }`}
                      value={formData.joiningDate}
                      onChange={(e) => {
                        setFormData({ ...formData, joiningDate: e.target.value });
                        setErrors({ ...errors, joiningDate: "" });
                      }}
                    />

                    {errors.joiningDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.joiningDate}
                      </p>
                    )}

                  </div>
                </div>

                <h4 className="font-semibold text-sm mt-5 mb-3">Personal Details</h4>

                {/* Row 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Father Name</h4>
                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.fatherName ? "border-red-500" : ""
                        }`}
                      placeholder="Father Name"
                      value={formData.fatherName}
                      onChange={(e) => {
                        setFormData({ ...formData, fatherName: e.target.value });
                        setErrors({ ...errors, fatherName: "" });
                      }}
                    />

                    {errors.fatherName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fatherName}
                      </p>
                    )}


                  </div>

                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Mother Name</h4>
                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.motherName ? "border-red-500" : ""
                        }`}
                      placeholder="Mother Name"
                      value={formData.motherName}
                      onChange={(e) => {
                        setFormData({ ...formData, motherName: e.target.value });
                        setErrors({ ...errors, motherName: "" });
                      }}
                    />

                    {errors.motherName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.motherName}
                      </p>
                    )}

                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex gap-4 mt-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Blood Group</h4>
                    <select
                      className={`w-full border px-3 py-2 rounded bg-white ${errors.bloodGroup ? "border-red-500" : ""
                        }`}
                      value={formData.bloodGroup}
                      onChange={(e) => {
                        setFormData({ ...formData, bloodGroup: e.target.value });
                        setErrors({ ...errors, bloodGroup: "" });
                      }}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>

                    {errors.bloodGroup && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bloodGroup}
                      </p>
                    )}

                  </div>


                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Gender</h4>
                    <select
                      className={`w-full border px-3 py-2 rounded bg-white ${errors.gender ? "border-red-500" : ""
                        }`}
                      value={formData.gender}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value });
                        setErrors({ ...errors, gender: "" });
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    {errors.gender && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.gender}
                      </p>
                    )}

                  </div>

                </div>

                {/* Row 3 */}
                <div className="flex gap-4 mt-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Date of Birth</h4>
                    <input
                      type="date"
                      className={`w-full border px-3 py-2 rounded ${errors.dob ? "border-red-500" : ""
                        }`}
                      value={formData.dob}
                      onChange={(e) => {
                        setFormData({ ...formData, dob: e.target.value });
                        setErrors({ ...errors, dob: "" });
                      }}
                    />

                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dob}
                      </p>
                    )}

                  </div>

                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Marital Status</h4>
                    <select
                      className={`w-full border px-3 py-2 rounded bg-white ${errors.maritalStatus ? "border-red-500" : ""
                        }`}
                      value={formData.maritalStatus}
                      onChange={(e) => {
                        setFormData({ ...formData, maritalStatus: e.target.value });
                        setErrors({ ...errors, maritalStatus: "" });
                      }}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>

                    {errors.maritalStatus && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.maritalStatus}
                      </p>
                    )}

                  </div>

                </div>

                {/* Row 4 */}
                <div className="flex gap-4 mt-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">
                      Other Mobile Number
                    </h4>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Other Mobile Number"
                      value={formData.alternatePhone}
                      onChange={(e) =>
                        setFormData({ ...formData, alternatePhone: e.target.value })
                      }
                    />
                  </div>



                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Other Email</h4>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Other Email"
                      value={formData.alternateEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, alternateEmail: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Row 5 */}
                <div className="flex gap-4 mt-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Nationality</h4>
                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.nationality ? "border-red-500" : ""
                        }`}
                      placeholder="Nationality"
                      value={formData.nationality}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                        setFormData({ ...formData, nationality: value });
                        setErrors({ ...errors, nationality: "" });
                      }}
                    />

                    {errors.nationality && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nationality}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">Pincode</h4>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pincode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />

                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pincode}
                      </p>
                    )}

                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col mt-3">
                  <h4 className="text-xs font-medium mb-1">Address</h4>
                  <textarea
                    className={`w-full border px-3 py-2 rounded ${errors.address ? "border-red-500" : ""
                      }`}
                    placeholder="Full Address"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      setErrors({ ...errors, address: "" });
                    }}
                  />

                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}

                </div>

                {/* Row 6 */}
                <div className="flex gap-4 mt-3">
                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">State</h4>
                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.state ? "border-red-500" : ""
                        }`}
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ ...formData, state: e.target.value });
                        setErrors({ ...errors, state: "" });
                      }}
                    />

                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}

                  </div>

                  <div className="flex flex-col w-1/2">
                    <h4 className="text-xs font-medium mb-1">City</h4>
                    <input
                      className={`w-full border px-3 py-2 rounded ${errors.city ? "border-red-500" : ""
                        }`}
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        setErrors({ ...errors, city: "" });
                      }}
                    />

                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.city}
                      </p>
                    )}

                  </div>
                </div>






                {/* Save Button (optional reminder) */}
                <button
                  type="submit"
                  className="bg-sky-700 text-white px-4 py-2 rounded mt-3"
                >
                  Save
                </button>

              </form>
            </div>
          </div>
        </div >
      )
      }

      {showViewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">

            {/* Close */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>

            <h3 className="font-semibold text-l mb-2">Employee Photo</h3>
            <div className="flex items-center gap-4">
              {viewEmployee?.photo ? (
                <img
                  src={viewEmployee.photo}
                  alt="Employee"
                  className="w-32 h-40 object-cover border rounded"
                />
              ) : (
                <p className="text-sm text-gray-500">No photo uploaded</p>
              )}
            </div>


            <h2 className="text-xl font-semibold mt-8 mb-6">
              Employee Complete Details
            </h2>

            {/* ================= BASIC INFO ================= */}
            <h3 className="font-semibold text-sm mb-2">Basic Information</h3>
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div className="w-[48%]"><b>Name:</b> {viewEmployee?.name}</div>
              <div className="w-[48%]"><b>Email:</b> {viewEmployee?.email}</div>
              <div className="w-[48%]"><b>Phone:</b> {viewEmployee?.phone}</div>
              <div className="w-[48%]">
                <b>Status:</b>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${viewEmployee?.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                    }`}
                >
                  {viewEmployee?.status}
                </span>
              </div>
            </div>


            {/* ================= JOB DETAILS ================= */}
            <h3 className="font-semibold text-sm mb-2">Job Details</h3>
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div className="w-[48%]"><b>Department:</b> {viewEmployee?.department?.name || "—"}</div>
              <div className="w-[48%]"><b>Designation:</b> {viewEmployee?.designation}</div>
              <div className="w-[48%]"><b>Role:</b> {viewEmployee?.role}</div>
              <div className="w-[48%]"><b>Manager:</b> {viewEmployee?.manager}</div>
              <div className="w-[48%]"><b>Joining Date:</b> {viewEmployee?.joiningDate}</div>
            </div>

            {/* ================= PERSONAL DETAILS ================= */}
            <h3 className="font-semibold text-sm mb-2">Personal Details</h3>
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div className="w-[48%]"><b>Father Name:</b> {viewEmployee?.fatherName}</div>
              <div className="w-[48%]"><b>Mother Name:</b> {viewEmployee?.motherName}</div>
              <div className="w-[48%]"><b>Gender:</b> {viewEmployee?.gender}</div>
              <div className="w-[48%]"><b>Blood Group:</b> {viewEmployee?.bloodGroup}</div>
              <div className="w-[48%]"><b>Date of Birth:</b> {viewEmployee?.dob}</div>
              <div className="w-[48%]"><b>Marital Status:</b> {viewEmployee?.maritalStatus}</div>
              <div className="w-[48%]"><b>Nationality:</b> {viewEmployee?.nationality}</div>
            </div>

            {/* ================= CONTACT DETAILS ================= */}
            <h3 className="font-semibold text-sm mb-2">Contact Details</h3>
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div className="w-[48%]"><b>Alternate Phone:</b> {viewEmployee?.alternatePhone}</div>
              <div className="w-[48%]"><b>Alternate Email:</b> {viewEmployee?.alternateEmail}</div>
            </div>

            {/* ================= ADDRESS ================= */}
            <h3 className="font-semibold text-sm mb-2">Address</h3>
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div className="w-[48%]"><b>State:</b> {viewEmployee?.state}</div>
              <div className="w-[48%]"><b>City:</b> {viewEmployee?.city}</div>
              <div className="w-[48%]"><b>Pincode:</b> {viewEmployee?.pincode}</div>
              <div className="w-full">
                <b>Full Address:</b> {viewEmployee?.address}
              </div>
            </div>

            {/* ================= PHOTO ================= */}
            {/* <h3 className="font-semibold text-sm mb-2">Employee Photo</h3>
            <div className="flex items-center gap-4">
              {viewEmployee?.photo ? (
                <img
                  src={viewEmployee.photo}
                  alt="Employee"
                  className="w-32 h-40 object-cover border rounded"
                />
              ) : (
                <p className="text-sm text-gray-500">No photo uploaded</p>
              )}
            </div> */}

          </div>
        </div>
      )}


      {/* DELETE MODAL */}
      {
        showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-sm rounded-xl p-6 text-center relative">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4"
              >
                <FaTimes />
              </button>



              <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
              <p className="text-sm text-gray-600 mb-6">
                Do you really want to delete <b>{current?.name}</b>?
              </p>

              <div className="flex justify-center gap-4">

                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}
