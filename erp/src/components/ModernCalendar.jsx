import { useState } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export default function ModernCalendar() {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrent(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrent(new Date(year, month + 1, 1));
  };

  const monthName = current.toLocaleString("default", { month: "long" });

  return (
    <div className="w-72 bg-white rounded-xl p-4 shadow">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">
          {monthName} {year}
        </h2>
        <div className="space-x-2">
          <button
            onClick={prevMonth}
            className="bg-green-100 px-2 rounded hover:bg-green-200"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            className="bg-green-100 px-2 rounded hover:bg-green-200"
          >
            ›
          </button>
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-2">
        {days.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>


      {/* Dates */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {Array(firstDay).fill("").map((_, i) => (
          <div key={"empty" + i}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(year, month, i + 1);
          const isSelected =
            selected.toDateString() === date.toDateString();

          return (
            <div
              key={i}
              onClick={() => setSelected(date)}
              className={`
                cursor-pointer p-2 rounded-full text-sm
                ${isSelected ? "bg-green-600 text-white" : "bg-green-100 hover:bg-green-200"}
              `}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
