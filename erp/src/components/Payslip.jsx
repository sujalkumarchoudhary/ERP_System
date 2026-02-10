export default function Payslip() {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="font-semibold">Recent Payslip</h2>
      <p className="text-sm mt-2">December 2021</p>
      <h1 className="text-3xl font-bold mt-4">₹65,000</h1>

      <div className="flex gap-3 mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          View
        </button>
        <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded w-full">
          Download
        </button>
      </div>
    </div>
  );
}
