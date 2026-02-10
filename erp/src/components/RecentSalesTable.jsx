import { useState, useEffect } from "react";
import { FaEye, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "./../utils/axiosInstance";

export default function RecentSalesTable() {
  /* ---------------- STATE ---------------- */

  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("");
  const [current, setCurrent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    price: "",
    quantity: "",
    total: "",
    status: "Live",
  });

  /* ---------------- FETCH SALES ---------------- */

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axiosInstance.get("/sales");
        setSales(res.data || []);
      } catch (error) {
        console.error("Fetch sales error", error);
      }
    };
    fetchSales();
  }, []);

  /* ---------------- PAGINATION ---------------- */

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const paginatedSales = sales.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );



  /* ---------------- JSX ---------------- */

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-semibold mb-4">Recent Sales</h3>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Banner Name</th>
            <th className="text-left">Start Date</th>
            <th className="text-left">End Date</th>
            <th className="text-left">Price</th>
            <th className="text-left">Quantity</th>
            <th className="text-left">Total</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {paginatedSales.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="px-4 py-3">{item.name}</td>
              <td>{item.start?.slice(0, 10)}</td>
              <td>{item.end?.slice(0, 10)}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.total}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between p-4">
        <button  disabled={page === 1} onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
          Next
        </button>
      </div>
    </div>
  );
}
