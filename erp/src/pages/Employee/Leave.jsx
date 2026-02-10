import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

import { Stethoscope, Palmtree, Coffee, Baby } from "lucide-react";
const TOTAL_LEAVES = 10;

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";


export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    type: "Sick",
    from: "",
    to: "",
    reason: "",
  });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      const res = await axiosInstance.get("/leaves/my");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };






  // const leaveConfig = [
  //   { type: "Sick", icon: Stethoscope, color: "text-orange-500" },
  //   { type: "Casual", icon: Coffee, color: "text-orange-500" },

  //     { type: "Approved", icon: Plus, color: "text-green-600", value: totalApproved },
  // { type: "Rejected", icon: Baby, color: "text-red-600", value: totalRejected },

  // ];


  /* ================= FILTERED LEAVES ================= */

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredLeaves = leaves.filter((l) => {
    const statusMatch = statusFilter ? l.status === statusFilter : true;
    const typeMatch = typeFilter ? l.type === typeFilter : true;
    return statusMatch && typeMatch;
  });


  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 9;


  const totalPages = Math.ceil(filteredLeaves.length / rowsPerPage);

  const paginatedLeaves = filteredLeaves.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter]);



  /* ================= DAY COUNT ================= */

  /* ================= DAY COUNT ================= */

  const countDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  /* ================= USED LEAVES ================= */

  const used = {
    Sick: 0,
    Casual: 0,
  };

  leaves.forEach((l) => {
    if (l.status === "Approved") {
      const days = countDays(l.from, l.to);
      if (used[l.type] !== undefined) {
        used[l.type] += days;
      }
    }
  });

  /* ================= APPROVED & REJECTED ================= */

  const totalApproved = leaves.filter(l => l.status === "Approved").length;
  const totalRejected = leaves.filter(l => l.status === "Rejected").length;

  /* ================= SUMMARY CONFIG ================= */

  const leaveConfig = [
    { type: "Sick", icon: Stethoscope, color: "text-orange-500" },
    { type: "Casual", icon: Coffee, color: "text-orange-500" },

    { type: "Approved", icon: Plus, color: "text-green-600", value: totalApproved },
    { type: "Rejected", icon: Baby, color: "text-red-600", value: totalRejected },
  ];



   /* ================= CHART DATA ================= */
  const donutData = [
    { name: "Sick Used", value: used.Sick },
    { name: "Casual Used", value: used.Casual },
    { name: "Remaining", value: TOTAL_LEAVES * 2 - (used.Sick + used.Casual) }
  ];

  const barData = [
    { name: "Approved", value: totalApproved },
    { name: "Rejected", value: totalRejected }
  ];

  const COLORS = ["#fb923c", "#a855f7", "#22c55e"];


  /* ================= APPLY ================= */

  const handleApplyLeave = async () => {
    if (!formData.from || !formData.to || !formData.reason) return alert("Fill all fields");

    try {
      await axiosInstance.post("/leaves", formData);
      fetchMyLeaves();
      setShowModal(false);
      setFormData({ type: "Sick", from: "", to: "", reason: "" });
    } catch {
      alert("Failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Leave Balance</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Apply Leave
        </button>
      </div>

      {/* ================= SUMMARY BOXES ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {leaveConfig.map(({ type, icon: Icon, color, value }) => (
          <div
            key={type}
            className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-700">
                {type === "Approved" || type === "Rejected"
                  ? `Total ${type}`
                  : `${type} Leaves`}
              </p>

              <p className="text-sm mt-2 text-gray-600">
                {type === "Approved" || type === "Rejected"
                  ? `${value} Requests`
                  : `${used[type] || 0} / ${TOTAL_LEAVES} Days Used`}
              </p>
            </div>

            <Icon size={28} className={color} />
          </div>
        ))}

      </div>
      {/* ================= FILTERS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Leave Usage</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Leave Requests Status</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      




      <div className="flex justify-end gap-3 mb-3 border-none ">

        <select
          className="shadow-sm w-30 h-9 p-2 rounded text-sm border-none focus:outline-none focus:ring-0 focus:border-gray-300"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select
          className="shadow-sm w-30 h-9 p-2 rounded text-sm border-none focus:outline-none focus:ring-0 focus:border-gray-300"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option>Sick</option>
          <option>Casual</option>
          <option>Vacation</option>
          <option>Paternity</option>
        </select>

      </div>


      {/* ================= HISTORY TABLE ================= */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <h2 className="p-4 font-semibold">Leave Request History</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Leave Type</th>
              <th className="p-3">Dates Requested</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Submitted</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLeaves.map((l) => (

              <tr key={l._id} className="">

                <td className="p-3">{l.type}</td>

                <td className="p-3">
                  {l.from.slice(0, 10)} - {l.to.slice(0, 10)}
                </td>

                <td className="p-3">{l.reason}</td>

                <td className="p-3">{l.createdAt?.slice(0, 10)}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${l.status === "Approved" && "bg-green-100 text-green-700"}
                      ${l.status === "Pending" && "bg-yellow-100 text-yellow-700"}
                      ${l.status === "Rejected" && "bg-red-100 text-red-700"}
                    `}
                  >
                    {l.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {leaves.length === 0 && (
          <p className="p-4 text-gray-500">No leaves yet</p>
        )}

        <div className="flex justify-between items-center p-4 text-sm">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-1 rounded bg-gray-200 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-1 rounded bg-gray-200 disabled:opacity-40"
          >
            Next
          </button>

        </div>


      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="font-semibold mb-4">Apply Leave</h2>

            <div className="space-y-3">

              <select
                className="w-full border p-2 rounded"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Sick</option>
                <option>Casual</option>
                <option>Vacation</option>
                <option>Paternity</option>
              </select>

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              />

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />

            </div>

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleApplyLeave}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>

            </div>
          </div>
        </div>

      )}



    </div>
  );
}
