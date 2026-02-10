import React, { useState } from "react";
import { Search } from "lucide-react";

export default function EmployeeStatus({ employees = [] }) {
  const [filter, setFilter] = useState("all"); // all | ontime | late
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Extract unique departments
  const departments = ["All", ...new Set(employees.map(e => e.userId?.department?.name).filter(Boolean))];

  // Filtering Logic
  const filteredEmployees = employees.filter((row) => {
    const emp = row.userId;
    if (!emp) return false;

    // Search Filter
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());

    // Department Filter
    const matchesDept = selectedDept === "All" || emp.department?.name === selectedDept;

    // Status Filter
    let matchesStatus = true;
    if (filter === "ontime") matchesStatus = !row.isLate;
    if (filter === "late") matchesStatus = row.isLate;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="w-90 bg-white rounded-2xl shadow-md p-4 space-y-4">

      {/* HEADER: DEPARTMENT SELECTOR */}
      <div className="flex justify-between items-center text-sm font-medium">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-transparent outline-none cursor-pointer"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <span>▼</span>
      </div>

      {/* TABS */}
      <div className="flex gap-4 text-sm border-b">
        <button
          onClick={() => setFilter("all")}
          className={`pb-2 font-semibold ${filter === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-400"
            }`}
        >
          Working ({employees.length})
        </button>
        <button
          onClick={() => setFilter("ontime")}
          className={`pb-2 font-semibold ${filter === "ontime" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-400"
            }`}
        >
          On Time ({employees.filter((e) => !e.isLate).length})
        </button>
        <button
          onClick={() => setFilter("late")}
          className={`pb-2 font-semibold ${filter === "late" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-400"
            }`}
        >
          Late ({employees.filter((e) => e.isLate).length})
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center border rounded-lg px-3 py-2 text-sm">
        <input
          placeholder="Search employees"
          className="flex-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="text-gray-400" size={16} />
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {filteredEmployees.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No employees found</p>
        )}

        {filteredEmployees.map((row) => {
          const emp = row.userId;
          if (!emp) return null;

          return (
            <div key={row._id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {emp.avatar ? (
                  <img src={emp.avatar} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-sm">
                    {emp.name?.[0]}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-sm">{emp.name}</p>
                  <p className="text-xs text-gray-400">
                    {emp.department?.name || "No Department"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Punch In: {row.punchIn ? new Date(row.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${row.isLate ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
              >
                {row.isLate ? "Late" : "On Time"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
