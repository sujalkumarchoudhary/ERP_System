import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ModernCalendar from "../../components/ModernCalendar";
import EmployeeStatus from "../../components/EmployeeStatus";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";





const AttendanceDashboard = () => {
    const [departments, setDepartments] = useState([]);
    const [chartData, setChartData] = useState([]);

    // Fetch Chart Data
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get("/attendance/stats");
                setChartData(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchStats();
    }, []);

    // Fetch departments on mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get("/departments");
                setDepartments(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDepartments();
    }, []);


    // For backlog (Pending Leaves)
    const [backlog, setBacklog] = useState([]);

    useEffect(() => {
        const fetchBacklog = async () => {
            try {
                // Fetching all leaves and filtering pending ones (or add ?status=Pending to API)
                const res = await axiosInstance.get("/leaves?status=Pending");
                // API might return filtered or all. Let's filter client side to be safe if API ignores query
                const pending = Array.isArray(res.data)
                    ? res.data.filter(l => l.status === "Pending")
                    : res.data.data?.filter(l => l.status === "Pending") || []; // Handle pagination response

                setBacklog(pending);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBacklog();
    }, []);

    // ✨ RESTORED: For employee list (Active Attendance)
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axiosInstance.get("/attendance/active");
                setEmployees(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen p-6 grid grid-cols-12 gap-6">

            <div className="text-xl mb-7 font-semibold col-span-12">
                <h2>Attendance (Admin)</h2>
            </div>

            <h2 className="text-2xl font-bold col-span-12 mb-2">Departments Overview</h2>
            <div className="flex space-y-4 mb-5 font-semibold col-span-12 gap-5 flex-wrap">
                {departments.map(dep => (
                    <div key={dep._id} className="bg-white p-4 rounded-xl shadow h-30 w-67 hover:shadow-lg transition">
                        <h3 className="font-semibold text-lg">{dep.name}</h3>
                        <p className="text-3xl font-bold mt-2 text-indigo-600">
                            {dep.totalEmployees || 0}
                        </p>
                        <div className="flex gap-3 mt-2 text-sm">
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">On Time: {dep.onTime || 0}</span>
                            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded">Late: {dep.late || 0}</span>
                        </div>
                    </div>
                ))}
            </div>


            {/* LEFT SIDE */}
            <div className="col-span-7 space-y-6">

                {/* 📊 Chart */}
                <div className="bg-white rounded-xl p-6 shadow h-80">
                    <h2 className="font-semibold mb-4">Attendance Trends</h2>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="ontime" fill="#4F46E5" radius={[4, 4, 0, 0]} name="On Time" />
                            <Bar dataKey="late" fill="#EF4444" radius={[4, 4, 0, 0]} name="Late" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 📅 Calendar BELOW chart */}
                <div className="flex gap-6">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <ModernCalendar />
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow flex-1">
                        <h3 className="font-semibold mb-3">Pending Leaves (Backlog)</h3>

                        <div className="overflow-y-auto max-h-60">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="p-2 text-left">Name</th>
                                        <th className="p-2">Type</th>
                                        <th className="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {backlog.length === 0 ? (
                                        <tr><td colSpan="3" className="p-4 text-center text-gray-400">No pending requests</td></tr>
                                    ) : (
                                        backlog.map(leave => (
                                            <tr key={leave._id} className="border-b">
                                                <td className="p-2 font-medium">{leave.employeeId?.name || "Unknown"}</td>
                                                <td className="p-2 text-center">{leave.type}</td>
                                                <td className="p-2 text-center text-orange-500">{leave.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-span-3 ml-10">
                <EmployeeStatus employees={employees} />
            </div>

        </div>
    );
}

export default AttendanceDashboard;
