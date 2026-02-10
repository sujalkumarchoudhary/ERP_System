import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axiosInstance from "../utils/axiosInstance";

/* ================= HELPERS ================= */

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ChartsSection() {
  /* ================= STATE ================= */

  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    minPrice: "",
    maxPrice: "",
  });

  /* ================= FETCH SALES ================= */

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axiosInstance.get("/sales");
        setSales(res.data);
      } catch (err) {
        console.error("Chart sales fetch error", err);
      }
    };

    fetchSales();
  }, []);

  /* ================= MONTHLY SALES (REAL DATA) ================= */

  const monthlySales = useMemo(() => {
    const map = {};

    sales.forEach((s) => {
      if (!s.start || !s.total) return;

      const date = new Date(s.start);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (!map[key]) {
        map[key] = { month, year, amount: 0 };
      }

      map[key].amount += Number(s.total);
    });

    return Object.values(map);
  }, [sales]);

  /* ================= FILTERED MONTHLY SALES ================= */

  const filteredSales = useMemo(() => {
    return monthlySales.filter((item) => {
      if (filters.month && item.month !== filters.month) return false;
      if (filters.year && item.year !== Number(filters.year)) return false;
      if (filters.minPrice && item.amount < Number(filters.minPrice))
        return false;
      if (filters.maxPrice && item.amount > Number(filters.maxPrice))
        return false;
      return true;
    });
  }, [monthlySales, filters]);

  /* ================= INVENTORY (DERIVED FROM SALES) ================= */

  const inventoryData = useMemo(() => {
    const map = {};

    sales.forEach((s) => {
      if (!s.name || !s.quantity) return;

      if (!map[s.name]) {
        map[s.name] = {
          name: s.name,
          count: 0,
        };
      }

      map[s.name].count += Number(s.quantity);
    });

    return Object.values(map);
  }, [sales]);

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Chart Filters</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <select
            className="border px-2 py-1 rounded"
            value={filters.month}
            onChange={(e) =>
              setFilters({ ...filters, month: e.target.value })
            }
          >
            <option value="">All Months</option>
            {monthNames.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Year (e.g. 2025)"
            className="border px-2 py-1 rounded"
            value={filters.year}
            onChange={(e) =>
              setFilters({ ...filters, year: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Min Amount"
            className="border px-2 py-1 rounded"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Max Amount"
            className="border px-2 py-1 rounded"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={filteredSales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#6366F1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Sold */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-4">Items Sold</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={inventoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
