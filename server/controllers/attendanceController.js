import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const today = () => new Date().toISOString().split("T")[0];


// ================= PUNCH IN =================
export const punchIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = today();

    const exists = await Attendance.findOne({ userId, date: currentDate });
    if (exists)
      return res.status(400).json({ message: "Already punched in today" });

    const officeTime = new Date();
    officeTime.setHours(9, 30, 0, 0);

    const punchTime = new Date();

    let lateMinutes = 0;
    let isLate = false;

    if (punchTime > officeTime) {
      lateMinutes = Math.floor((punchTime - officeTime) / 60000);
      isLate = true;
    }

    const record = await Attendance.create({
      userId,
      date: currentDate,
      punchIn: punchTime,
      lateMinutes,
      isLate
    });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= PUNCH OUT =================
export const punchOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = today();

    const record = await Attendance.findOne({ userId, date: currentDate });

    if (!record)
      return res.status(400).json({ message: "Punch in first" });

    const punchOutTime = new Date();

    const workedMinutes = Math.floor(
      (punchOutTime - record.punchIn) / 60000
    );

    const officeMinutes = 8 * 60;

    record.punchOut = punchOutTime;
    record.totalMinutes = workedMinutes;
    record.overtimeMinutes =
      workedMinutes > officeMinutes ? workedMinutes - officeMinutes : 0;

    await record.save();

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= MY ATTENDANCE =================
export const getMyAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ userId: req.user.id })
      .populate("userId", "name email role")
      .sort({ date: -1 });

    res.json(data);

  } catch (err) {
    console.error("MY ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================= GET ACTIVE EMPLOYEES (ADMIN) =================
export const getActiveEmployees = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. Find all active attendance (punched in, not out)
    const records = await Attendance.find({
      date: today,
      punchOut: null,
    }).lean();

    // 2. Enrich with Employee/Department data
    const populatedRecords = await Promise.all(
      records.map(async (record) => {
        // Fetch User details (Name, Email)
        // We'll trust the User model exists since Attendance links to it
        // Or we could populate it in the first query if we change schema refs?
        // Attendance ref is 'User'.

        // Doing it manually to get Employee -> Department link
        const employee = await Employee.findOne({ user: record.userId })
          .populate("department")
          .populate("user", "name email profileImage"); // Get user details via Employee

        if (employee) {
          // Construct the shape expected by frontend: row.userId = { name, department: {name}, avatar }
          return {
            ...record,
            userId: {
              _id: record.userId,
              name: employee.user?.name || employee.name,
              email: employee.user?.email || employee.email,
              avatar: employee.user?.profileImage,
              department: employee.department, // This is the fix
            },
          };
        } else {
          // Fallback if no employee record found (rare, but possible for strict admins)
          return record;
        }
      })
    );

    // Filter out nulls if any
    res.json(populatedRecords);
  } catch (err) {
    console.error("Active Employees Error:", err);
    res.status(500).json({ message: err.message });
  }
};
// ================= GET ATTENDANCE STATS (CHART) =================
export const getAttendanceStats = async (req, res) => {
  try {
    // Get last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    // Filter by date range (string comparison works for YYYY-MM-DD)
    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    const stats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startStr, $lte: endStr },
        },
      },
      {
        $group: {
          _id: "$date", // Group by YYYY-MM-DD
          ontime: { $sum: { $cond: [{ $eq: ["$isLate", false] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$isLate", true] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format for Recharts: { day: "Mon", ontime: 5, late: 2 }
    const formattedData = stats.map((item) => {
      const date = new Date(item._id);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }), // Mon, Tue...
        ontime: item.ontime,
        late: item.late,
      };
    });

    res.json(formattedData);
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: err.message });
  }
};
