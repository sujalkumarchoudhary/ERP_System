import Employee from "../models/Employee.js";
import Sale from "../models/Sale.js";
import Inventory from "../models/Inventory.js"; // ✅ ADD
import Department from "../models/Department.js";


/* ================= DASHBOARD HEADER ================= */
export const getMyProfile = async (req, res) => {
  res.status(200).json({
    name: "Employee User",
    role: "employee",
  });
};

/* ================= STATS CARDS (REAL DATA) ================= */
export const getStats = async (req, res) => {
  try {
    // ✅ Total Employees
    const totalEmployees = await Employee.countDocuments();

    // ✅ Total Revenue
    const revenueResult = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const totalDepartments = await Department.countDocuments();

    // ✅ TOTAL STOCK FROM INVENTORY (ADD ONLY)
    const stockResult = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" },
        },
      },
    ]);

    const totalStock =
      stockResult.length > 0 ? stockResult[0].totalStock : 0;

    res.status(200).json({
      totalEmployees,
      totalRevenue,
      totalDepartments,
      totalStock, // ✅ ADDED
    });
  } catch (error) {
    console.error("GET STATS ERROR:", error.message);
    res.status(500).json({
      message: "Dashboard stats failed",
    });
  }
};

/* ================= CHARTS (REAL DATA) ================= */
export const getChartsData = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalSales: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map MongoDB day numbers (1=Sun, 7=Sat) to labels
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const labels = [];
    const sales = [];

    // Initialize with 0 for all days to ensure continuous chart
    const today = new Date().getDay();
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      labels.push(days[dayIndex]);

      const found = salesData.find((d) => d._id === dayIndex + 1);
      sales.push(found ? found.totalSales : 0);
    }

    res.status(200).json({
      labels,
      sales,
    });
  } catch (error) {
    console.error("GET CHARTS ERROR:", error);
    res.status(500).json({ message: "Charts data failed" });
  }
};

/* ================= RECENT SALES (REAL DATA) ================= */
export const getRecentSales = async (req, res) => {
  try {
    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Transform to match frontend expected format
    const formattedSales = recentSales.map((sale) => ({
      id: sale._id,
      customer: sale.name, // Assuming 'name' is customer name
      amount: sale.total,
      status: sale.status,
    }));

    res.status(200).json(formattedSales);
  } catch (error) {
    console.error("GET RECENT SALES ERROR:", error);
    res.status(500).json({ message: "Recent sales failed" });
  }
};
