import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function EmployeeAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/announcements/my");
    setAnnouncements(res.data);

  } catch (error) {
    console.error("Fetch announcements error", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white rounded-xl shadow p-6 w-138">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Announcements</h2>
      </div>

      {/* CONTENT (ONLY 2 VISIBLE + SCROLL) */}
      <div className="max-h-28  pr-2 space-y-3 overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-100
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400">
        {loading ? (
          <p className="text-sm text-gray-500">
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-gray-500">
            No announcements available
          </p>
        ) : (
          announcements.map((a) => (
            <div
              key={a._id}
              className="border-l-4 border-blue-500 pl-3"
            >
              <p className="text-sm text-gray-800">
                {a.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
