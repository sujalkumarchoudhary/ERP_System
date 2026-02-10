import { useState } from "react";

export default function DepartmentTable({ departments }) {

  /* ================= FILTER ================= */
  const [filter, setFilter] = useState("All");

  const filteredDepartments =
    filter === "All"
      ? departments
      : departments.filter(
          (d) => d.name.toLowerCase() === filter.toLowerCase()
        );

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const paginatedDepartments = filteredDepartments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-4">

      {/* ===== FILTER BUTTONS (NEW) ===== */}
      <div className="flex flex-wrap gap-2">
        {[
          "All",
          "Intern",
          "HR",
          "Manager",
          "Head Manager",
          "Admin",
        ].map((item) => (
          <button
            key={item}
            onClick={() => {
              setFilter(item);
              setPage(1); // reset page on filter change
            }}
            className={`px-4 py-1 rounded-lg text-sm border ${
              filter === item
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3">Department Head</th>
            </tr>
          </thead>

          <tbody>
            {paginatedDepartments.length === 0 ? (
              <tr>
                <td
                  colSpan="2"
                  className="text-center py-6 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedDepartments.map((dept) => (
                <tr key={dept.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {dept.name}
                  </td>
                  <td className="px-4 py-3">
                    {dept.head}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ===== PAGINATION (NEW) ===== */}
        <div className="flex justify-between items-center p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
