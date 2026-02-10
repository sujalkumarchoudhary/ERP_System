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

export default function Inventory() {
  /* ================= DATA ================= */

  const [items, setItems] = useState([]); // ✅ backend se aayega

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(""); // add | view | edit | delete
  const [current, setCurrent] = useState(null);

  /* ================= GRAPH FILTERS ================= */

  const [graphCategory, setGraphCategory] = useState("All");
  const [graphStatus, setGraphStatus] = useState("All");

  const graphFilteredItems = items.filter((i) => {
    if (graphCategory !== "All" && i.category !== graphCategory) return false;
    if (graphStatus !== "All" && i.status !== graphStatus) return false;
    return true;
  });

  /* ================= HELPERS ================= */
  const getStatusFromStock = (stock, currentStatus) => {
    if (currentStatus === "Discontinued") return "Discontinued";
    if (stock <= 0) return "Out of Stock";
    return "Available";
  };




  const emptyForm = {
    name: "",
    category: "",
    stock: "",
    price: "",
    status: "Available", // ✅ default

  };

  const [formData, setFormData] = useState(emptyForm);

  /* ================= FETCH ITEMS ================= */

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axiosInstance.get("/inventory");
        setItems(res.data);
      } catch (error) {
        console.error("Fetch inventory error", error);
      }
    };

    fetchItems();
  }, []);

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  /* ================= TABLE FILTER ================= */

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ================= GRAPH DATA ================= */

  const categoryData = [
    {
      name: "Electronics",
      value: graphFilteredItems.filter(
        (i) => i.category === "Electronics"
      ).length,
    },
    {
      name: "Furniture",
      value: graphFilteredItems.filter(
        (i) => i.category === "Furniture"
      ).length,
    },
    {
      name: "Other",
      value: graphFilteredItems.filter(
        (i) => !["Electronics", "Furniture"].includes(i.category)
      ).length,
    },
  ];

  const statusData = [
    {
      name: "Available",
      value: graphFilteredItems.filter(
        (i) => i.status === "Available"
      ).length,
    },
    {
      name: "Out of Stock",
      value: graphFilteredItems.filter(
        (i) => i.status === "Out of Stock"
      ).length,
    },
    {
      name: "Discontinued",
      value: graphFilteredItems.filter(
        (i) => i.status === "Discontinued"
      ).length,
    },
  ];


  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  /* ================= ACTIONS ================= */

  const openAdd = () => {
    setMode("add");
    setFormData(emptyForm);
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
      category: item.category,
      stock: item.stock,
      price: item.price,
      status: item.status, // ✅ MUST
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
      await axiosInstance.delete(`/inventory/${current._id}`);
      setItems(items.filter((i) => i._id !== current._id));
    } catch (error) {
      console.error("Delete error", error);
    }
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const finalStatus =
      formData.status === "Discontinued"
        ? "Discontinued"
        : formData.status === "Out of Stock"
          ? "Out of Stock"
          : Number(formData.stock) <= 0
            ? "Out of Stock"
            : "Available";

    const updatedData = {
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price),
      status: finalStatus,
    };

    try {
      if (mode === "add") {
        const res = await axiosInstance.post("/inventory", updatedData);
        setItems((prev) => [res.data, ...prev]);
      }

      if (mode === "edit") {
        const res = await axiosInstance.put(
          `/inventory/${current._id}`,
          updatedData
        );

        setItems((prev) =>
          prev.map((i) =>
            i._id === current._id ? res.data : i
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
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="text-sm text-gray-500">
          Manage inventory items and stock analytics
        </p>
      </div>

      {/* GRAPH FILTERS */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4">
        <select
          value={graphCategory}
          onChange={(e) => setGraphCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
        >
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Discontinued">Discontinued</option>
        </select>




      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold mb-4">
            Items by Category
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold mb-4">
            Stock Status
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

      {/* SEARCH + ADD */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/3 border px-4 py-2 rounded-lg"
        />

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Add Item
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedItems.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">₹{item.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${item.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Out of Stock"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3 flex justify-center gap-2">
                  <button onClick={() => openView(item)} className="bg-blue-500 text-white p-2 rounded">
                    <FaEye />
                  </button>
                  <button onClick={() => openEdit(item)} className="bg-indigo-500 text-white p-2 rounded">
                    <FaEdit />
                  </button>
                  <button onClick={() => openDelete(item)} className="bg-red-500 text-white p-2 rounded">
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
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-160 rounded-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-4 capitalize">
              {mode} Item
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
                <p><b>Category:</b> {current.category}</p>
                <p><b>Stock:</b> {current.stock}</p>
                <p><b>Price:</b> ₹{current.price}</p>
                <p><b>Status:</b> {current.status}</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 ">

                {/* ITEM NAME */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter item name"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Enter category"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  />
                </div>

                {/* STOCK */}
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Enter stock quantity"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.stock}
                    onChange={(e) => {
                      const stock = Number(e.target.value);
                      setFormData({ ...formData, stock });
                    }}
                    required
                  />
                </div>

                {/* PRICE */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter price"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-2 rounded-lg"
                >
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
