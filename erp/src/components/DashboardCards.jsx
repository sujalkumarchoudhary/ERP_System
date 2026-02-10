import { FaTasks, FaCheckCircle, FaClock } from "react-icons/fa";

export default function DashboardCards() {
  const cards = [
    {
      title: "Total Tasks",
      value: "24",
      icon: <FaTasks />,
      color: "bg-blue-500",
    },
    {
      title: "Completed",
      value: "18",
      icon: <FaCheckCircle />,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: "6",
      icon: <FaClock />,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
        >
          <div>
            <p className="text-gray-500">{card.title}</p>
            <h2 className="text-2xl font-bold">{card.value}</h2>
          </div>
          <div
            className={`text-white p-4 rounded-full ${card.color}`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
