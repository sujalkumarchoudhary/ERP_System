import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

export default function LeaveRequests() {

  /* ================= STATE ================= */
  const [requests, setRequests] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [actionType, setActionType] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 7;

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const fetchAllLeaves = async () => {
    try {
      const res = await axiosInstance.get("/leaves");
      setRequests(res.data);
    } catch (error) {
      console.error("Fetch leaves error", error);
    }
  };


  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");


  /* ================= ACTION ================= */

  const openConfirm = (req, action) => {
    setSelected(req);
    setActionType(action);
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    try {
      await axiosInstance.patch(`/leaves/${selected._id}`, {
        status: actionType === "approve" ? "Approved" : "Rejected",
        message:
          actionType === "approve"
            ? "Your leave request has been Approved."
            : "Your leave request has been Rejected.",
      });

      fetchAllLeaves();
      setShowConfirm(false);
    } catch (error) {
      console.error("Action error", error);
    }
  };

  /* ================= FILTER ================= */

  const pending = requests.filter(r => r.status === "Pending");
  const history = requests.filter(r => {
    if (r.status === "Pending") return false;

    const statusOk = statusFilter ? r.status === statusFilter : true;
    const typeOk = typeFilter ? r.type === typeFilter : true;

    return statusOk && typeOk;
  });

  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter]);



  const totalPages = Math.ceil(history.length / perPage);
  const paginatedHistory = history.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Leave Requests (Admin)</h1>
        <p className="text-sm text-gray-500">Manage employee leave approvals</p>
      </div>

      {/* ================= PENDING ================= */}

      <div className="bg-white rounded-xl shadow">
        <h2 className="font-semibold p-4 border-b">Pending Requests</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="text-left">Leave Type</th>
              <th className="text-left">From</th>
              <th className="text-left">To</th>
              <th className="text-left">Status</th>
              <th className="text-left">Reason</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {pending.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No pending requests
                </td>
              </tr>
            ) : (
              pending.map(req => (
                <tr key={req._id} className="border-t">
                  <td className="p-3 font-medium">{req.employeeName}</td>
                  <td>{req.type}</td>
                  <td>{req.from.slice(0, 10)}</td>
                  <td>{req.to.slice(0, 10)}</td>
                  <td className="flex items-center gap-1">
                    <Clock size={14} /> Pending
                  </td>
                  <td>{req.reason || "—"}</td>
                  <td className="flex justify-center gap-2 p-3">
                    <button
                      onClick={() => openConfirm(req, "approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openConfirm(req, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <div className="flex justify-end gap-3 px-4">

        <select
          className="shadow-sm w-32 h-9 px-2 rounded text-sm 
               focus:outline-none focus:ring-0 focus:border-gray-300"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select
          className="shadow-sm w-32 h-9 px-2 rounded text-sm 
               focus:outline-none focus:ring-0 focus:border-gray-300"
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

      {/* ================= HISTORY ================= */}
      <div className="bg-white shadow rounded-xl">
        <h2 className="font-semibold p-4">Leave Request History</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="text-left">Leave Type</th>
              <th className="text-left">Dates Requested</th>
              <th className="text-left">Reason</th>
              <th className="text-left">Submitted On</th>
              <th className="text-left">Status</th>
              <th className="text-center">Assigned To</th>
            </tr>
          </thead>

          <tbody>
            {paginatedHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No history found
                </td>
              </tr>
            ) : (
              paginatedHistory.map(req => (
                <tr key={req._id} className="">

                  <td className="p-3 font-medium">{req.employeeName}</td>

                  <td>{req.type}</td>

                  <td>
                    {req.from.slice(0, 10)} - {req.to.slice(0, 10)}
                  </td>

                  <td>{req.reason || "—"}</td>

                  <td>{req.createdAt?.slice(0, 10)}</td>

                  <td>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${req.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                      }`}>
                      {req.status}
                    </span>
                  </td>

                  <td className="font-medium text-gray-700 text-center">
                    {req.handledBy || "Admin"}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
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
        )}
      </div>

      {/* ================= CONFIRM POPUP ================= */}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-3">Are you sure?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you want to {actionType} this request?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded ${actionType === "approve"
                  ? "bg-green-600"
                  : "bg-red-600"
                  }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
