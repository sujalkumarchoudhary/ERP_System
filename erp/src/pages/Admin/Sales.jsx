import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
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

import axiosInstance from "../../utils/axiosInstance"; // ✅ backend connect

export default function Sales() {
  /* ---------------- DATA ---------------- */

  const [sales, setSales] = useState([]); // ✅ backend se aayega

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(""); // add | view | edit | delete
  const [current, setCurrent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    price: "",
    quantity: "",
    total: 0,
    status: "Live",
  });

  useEffect(() => {
    const price = Number(formData.price) || 0;
    const quantity = Number(formData.quantity) || 0;

    setFormData((prev) => ({
      ...prev,
      total: price * quantity,
    }));
  }, [formData.price, formData.quantity]);


  /* ---------------- FETCH SALES ---------------- */

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axiosInstance.get("/sales");
        setSales(res.data);
      } catch (error) {
        console.error("Fetch sales error", error);
      }
    };

    fetchSales();
  }, []);

  /* ---------------- PAGINATION ---------------- */

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  /* ---------------- GRAPH FILTER ---------------- */

  const [graphStatus, setGraphStatus] = useState("All");

  const graphFilteredSales = sales.filter((s) => {
    if (graphStatus !== "All" && s.status !== graphStatus) return false;
    return true;
  });

  /* ---------------- TABLE FILTER ---------------- */

  const filteredSales = sales.filter((item) => {
    if (!item.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    if (statusFilter !== "All" && item.status !== statusFilter)
      return false;

    return true;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const paginatedSales = filteredSales.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ---------------- GRAPH DATA ---------------- */

  const statusData = [
    {
      name: "Live",
      value: graphFilteredSales.filter(
        (s) => s.status === "Live"
      ).length,
    },
    {
      name: "Ended",
      value: graphFilteredSales.filter(
        (s) => s.status === "Ended"
      ).length,
    },
  ];

  const COLORS = ["#22c55e", "#9ca3af"];

  /* ---------------- ACTIONS ---------------- */

  const openAdd = () => {
    setMode("add");
    setFormData({ name: "", start: "", end: "", price: "", quantity: "", total: "", status: "Live" });
    setShowModal(true);
  };

  const openView = (item) => {
    setMode("view");
    setCurrent(item);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setMode("edit");
    setCurrent(item);
    setFormData({
      name: item.name,
      start: item.start?.slice(0, 10),
      end: item.end?.slice(0, 10),
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      status: item.status,
    });
    setShowModal(true);
  };

  const openDelete = (item) => {
    setMode("delete");
    setCurrent(item);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/sales/${current._id}`);
      setSales(sales.filter((s) => s._id !== current._id));
    } catch (error) {
      console.error("Delete error", error);
    }
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (mode === "add") {
        const res = await axiosInstance.post("/sales", formData);
        setSales([res.data, ...sales]);
      }

      if (mode === "edit") {
        const res = await axiosInstance.put(
          `/sales/${current._id}`,
          formData
        );

        setSales(
          sales.map((s) =>
            s._id === current._id ? res.data : s
          )
        );
      }
    } catch (error) {
      console.error("Save error", error);
    }

    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Sales</h1>
        <p className="text-sm text-gray-500">
          Sales performance and transaction management
        </p>
      </div>

      <h1 className="text-2xl font-semibold">Promotional Banners</h1>

      {/* GRAPH FILTER */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-4">
        <select
          value={graphStatus}
          onChange={(e) => setGraphStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="Live">Live</option>
          <option value="Ended">Ended</option>
        </select>
      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold mb-4">
            Banner Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold mb-4">
            Live vs Ended
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE FILTER + ADD */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <input
          type="text"
          placeholder="Search banners..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/3 border px-4 py-2 rounded-lg "
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Live">Live</option>
          <option value="Ended">Ended</option>
        </select>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          <FaPlus /> Add Banner
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Banner Name</th>
              <th className="text-left">Start Date</th>
              <th className="text-left">End Date</th>
              <th className="text-left">Price</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Total</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSales.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td>{item.start?.slice(0, 10)}</td>
                <td>{item.end?.slice(0, 10)}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.total}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${item.status === "Live"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-200 text-green-600"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button onClick={() => openView(item)} className="bg-blue-500 text-white p-2 rounded cursor-pointer">
                    <FaEye />
                  </button>
                  <button onClick={() => openEdit(item)} className="bg-indigo-500 text-white p-2 rounded cursor-pointer">
                    <FaEdit />
                  </button>
                  <button onClick={() => openDelete(item)} className="bg-red-500 text-white p-2 rounded cursor-pointer">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-4 capitalize">
              {mode} Banner
            </h2>

            {mode === "delete" ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <b>{current.name}</b>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-200 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : mode === "view" ? (
              <div className="space-y-2 text-sm">
                <p><b>Name:</b> {current.name}</p>
                <p><b>Start:</b> {current.start?.slice(0, 10)}</p>
                <p><b>End:</b> {current.end?.slice(0, 10)}</p>
                <p><b>Price:</b> {current.price}</p>
                <p><b>Quantity:</b> {current.quantity}</p>
                <p><b>Total:</b> {current.total}</p>
                <p><b>Status:</b> {current.status}</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-3">
                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Banner Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.start}
                  onChange={(e) =>
                    setFormData({ ...formData, start: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.end}
                  onChange={(e) =>
                    setFormData({ ...formData, end: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                  placeholder="Total"
                  value={formData.total}
                  readOnly
                />

                <select
                  className="w-full border px-3 py-2 rounded"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option>Live</option>
                  <option>Ended</option>
                </select>

                <button className="w-full bg-green-600 text-white py-2 rounded-lg">
                  Save
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
