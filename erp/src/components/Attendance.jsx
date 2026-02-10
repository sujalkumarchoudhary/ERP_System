import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AttendanceCard() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Present",
        data: [6, 9, 11, 10],
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        tension: 0.4,
      },
      {
        label: "Absent",
        data: [2, 1, 3, 2],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
      },
      {
        label: "Late",
        data: [1, 2, 1, 2],
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className=" bg-white rounded-xl shadow p-">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 ml-8">
        <h2 className="font-semibold text-lg">Attendance Overview</h2>
      </div>

      {/* Graph */}
        <div className="h-50 w-500 mb-2 ml-8" > {/* 👈 yahan size control hota hai */}
    <Line data={data} options={options} />
  </div>

      {/* Bottom Stats */}
      <div className="flex gap-6 mt-4 text-sm ml-7">
        <span className="flex items-center gap-1 text-green-600">
          <span className="w-3 h-3 bg-green-500 rounded"></span>
          22 Present
        </span>

        <span className="flex items-center gap-1 text-red-500">
          <span className="w-3 h-3 bg-red-500 rounded"></span>
          3 Absent
        </span>

        <span className="flex items-center gap-1 text-yellow-500">
          <span className="w-3 h-3 bg-yellow-500 rounded"></span>
          1 Late
        </span>
      </div>
    </div>
  );
}
