import React, { useEffect, useState } from "react";
import {
  Clock,
  CalendarDays,
  TrendingUp,
  AlarmClock,
  User,
} from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";

export default function AttendanceDashboard() {

  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [history, setHistory] = useState([]);
  const [today, setToday] = useState(null);

  // ================= LOAD DATA =================
  const loadAttendance = async () => {
    const res = await axiosInstance.get("/attendance/my");

    setHistory(res.data);

    if (res.data.length && !res.data[0].punchOut) {
      setIsPunchedIn(true);
      setToday(res.data[0]);
    } else {
      setIsPunchedIn(false);
      setToday(res.data[0] || null);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);


  // ================= LIVE TIMER =================
  const [liveSeconds, setLiveSeconds] = useState(0);
  useEffect(() => {
    if (!today?.punchIn || today?.punchOut) return;

    const start = new Date(today.punchIn).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      setLiveSeconds(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);

  }, [today]);

  const formatLive = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };



  // ================= PUNCH =================
  const handlePunchIn = async () => {
    try {
      await axiosInstance.post("/attendance/punch-in");
      await loadAttendance();   // 🔥 refresh UI
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };


  const handlePunchOut = async () => {
    try {
      await axiosInstance.post("/attendance/punch-out");
      await loadAttendance();   // 🔥 refresh UI
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };




  // ================= HELPERS =================
  const time = (d) =>
    d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";

  const hours = (min = 0) =>
    `${Math.floor(min / 60)}h ${min % 60}m`;

  const todayTotal = today?.totalMinutes || 0;

  const weekTotal = history.slice(0, 7)
    .reduce((sum, r) => sum + r.totalMinutes, 0);

  const monthTotal = history.reduce((sum, r) => sum + r.totalMinutes, 0);


  // ================= MONTHLY STATS =================
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const isThisMonth = (dateStr) => {
    const d = new Date(dateStr);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  };

  const monthOvertime = history
    .filter(r => isThisMonth(r.date))
    .reduce((sum, r) => sum + (r.overtimeMinutes || 0), 0);

  const monthLate = history
    .filter(r => isThisMonth(r.date))
    .reduce((sum, r) => sum + (r.lateMinutes || 0), 0);


  // ================= BREAK MINUTES =================
  const BREAK_MINUTES = 45;

  const workedMin = today?.totalMinutes || 0;
  const breakMin = workedMin > 0 ? BREAK_MINUTES : 0;

  const productiveMin = Math.max(workedMin - breakMin, 0);

  const overtimeMin = Math.max(productiveMin - 8 * 60, 0);

  const toHM = (min) =>
    `${Math.floor(min / 60)}h ${min % 60}m`;




  return (


    <div className="bg-gray-100 min-h-screen p-6 space-y-6">

      <div className="">
        <h1 className="text-2xl font-bold">Attendance</h1>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-12 gap-6">

        {/* PROFILE */}
        <div className="col-span-3 bg-white rounded-xl p-5 shadow flex flex-col justify-between">

          <div>
            <p className="text-gray-500">
              {isPunchedIn ? "Currently Working" : "Not Working"}
            </p>

            <h2 className="text-xl font-semibold">
              {new Date().toLocaleString()}
            </h2>

            <div className="flex justify-center my-4">
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center
                ${isPunchedIn ? "border-green-400" : "border-gray-300"}`}>
                <User size={40} />
              </div>
            </div>

            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
              Working Time : {isPunchedIn ? formatLive(liveSeconds) : hours(todayTotal)}
            </span>


            <p className="text-sm text-gray-500 mt-2">
              {today?.punchIn
                ? `Punch in at ${time(today.punchIn)}`
                : "Not punched in yet"}
            </p>

            {today?.isLate && (
              <p className="text-red-500 text-sm mt-1">
                Late by {today.lateMinutes} minutes
              </p>
            )}

          </div>

          <button
            onClick={isPunchedIn ? handlePunchOut : handlePunchIn}

            className={`py-2 rounded-lg mt-4 text-white transition
              ${isPunchedIn ? "bg-black" : "bg-green-600"}`}
          >
            {isPunchedIn ? "Punch Out" : "Punch In"}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-9 grid grid-rows-[auto_1fr] gap-6">

          {/* STATS */}
          <div className="grid grid-cols-5 gap-3">

            <Stat title="Total Hours Today" value={hours(todayTotal)} icon={<Clock />} />
            <Stat title="Total Late Month" value={`${monthLate} min`} icon={<AlarmClock className="text-red-500" />} />
            <Stat title="Total Hours Week" value={hours(weekTotal)} icon={<CalendarDays />} />
            <Stat title="Total Hours Month" value={hours(monthTotal)} icon={<TrendingUp />} />
            <Stat title="Total Overtime Month" value={hours(monthOvertime)} icon={<AlarmClock />} />

          </div>

          {/* SIMPLE TIMELINE (real later if you want) */}
          <div className="bg-white rounded-xl p-5 shadow space-y-4">

            {/* TOP STATS */}
            <div className="grid grid-cols-4 text-sm font-medium">

              <div>
                <p className="text-gray-400">Total Working hours</p>
                <p className="text-lg font-semibold">{toHM(workedMin)}</p>
              </div>

              <div>
                <p className="text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Productive Hours
                </p>
                <p className="text-lg font-semibold">{toHM(productiveMin)}</p>
              </div>

              <div>
                <p className="text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Break hours (1:00–1:45)
                </p>
                <p className="text-lg font-semibold">45 min</p>
              </div>

              <div>
                <p className="text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Overtime
                </p>
                <p className="text-lg font-semibold">{toHM(overtimeMin)}</p>
              </div>

            </div>

            {/* ===== IMAGE STYLE SEGMENTED TIMELINE ===== */}
            {today?.punchIn ? (() => {

              const startHour = 9;
              const endHour = 18;
              const blockMinutes = 15;

              const punchIn = new Date(today.punchIn);
              const punchOut = today.punchOut ? new Date(today.punchOut) : new Date();

              const breakStart = new Date(punchIn);
              breakStart.setHours(13, 0, 0, 0);

              const breakEnd = new Date(punchIn);
              breakEnd.setHours(13, 45, 0, 0);

              const timelineStart = new Date(punchIn);
              timelineStart.setHours(startHour, 0, 0, 0);

              const timelineEnd = new Date(punchIn);
              timelineEnd.setHours(endHour, 0, 0, 0);

              const overtimeStart = new Date(punchIn.getTime() + 8 * 60 * 60000);

              const blocks = [];

              for (
                let t = new Date(timelineStart);
                t <= timelineEnd;
                t = new Date(t.getTime() + blockMinutes * 60000)
              ) {

                let color = "bg-gray-200";

                if (t >= punchIn && t <= punchOut) color = "bg-green-500";
                if (t >= breakStart && t <= breakEnd) color = "bg-yellow-400";
                if (overtimeMin > 0 && t >= overtimeStart) color = "bg-blue-500";

                blocks.push(color);
              }

              return (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {blocks.map((c, i) => (
                    <div key={i} className={`${c} h-2 w-[1.1rem] rounded-md`} />
                  ))}
                </div>
              );
            })() : (
              <p className="text-gray-400">No activity yet</p>
            )}



            {/* TIMELINE BAR */}
            <div className="flex gap-2 items-center h-7">

              <div
                className="bg-green-500 rounded-lg h-full transition-all"
                style={{ width: `${(productiveMin / (8 * 60)) * 100}%` }}
              />

              <div
                className="bg-blue-500 rounded-lg h-full transition-all"
                style={{ width: `${(overtimeMin / (8 * 60)) * 100}%` }}
              />

            </div>


            {/* TIME SCALE */}
            <div className="flex gap-14 text-xs text-gray-400 pt-1">
              <span>09:00</span>
              <span>10:00</span>
              <span>11:00</span>
              <span>12:00</span>
              <span>01:00</span>
              <span>02:00</span>
              <span>03:00</span>
              <span>04:00</span>
              <span>05:00</span>
              <span>06:00</span>
            </div>

          </div>

        </div>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="font-semibold mb-4">Employee Attendance</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th>Check In</th>
              <th>Late Time</th>
              <th>Check Out</th>
              <th>Production</th>
            </tr>
          </thead>

          <tbody>
            {history.map((row) => (
              <tr key={row._id} className="text-center">
                <td className="p-2 text-left">{row.date}</td>
                <td>{time(row.punchIn)}</td>
                <td className="text-red-500">
                  {row.isLate ? `${row.lateMinutes} min` : "On time"}
                </td>
                <td>{time(row.punchOut)}</td>
                <td className="font-medium text-green-600">
                  {hours(row.totalMinutes)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

// ================= SMALL STAT COMPONENT =================
const Stat = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl p-4 shadow space-y-2">
    <div className="text-indigo-600">{icon}</div>
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-semibold">{value}</h2>
  </div>
);
