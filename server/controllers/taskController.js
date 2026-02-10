import Task from "../models/Task.js";
import Employee from "../models/Employee.js";

/* ================= ADMIN ================= */

// ✅ Admin ke sirf apne tasks
export const getAdminTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedBy: req.user.id,
    })
      .populate("employee", "name email")
      .populate("department", "name")   // ✅ YAHAN ADD KARNA HAI

      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("Get admin tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create task (IMPORTANT FIX)
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, employeeId, startDate, departmentId, endDate, codeReviewMeeting, clientPresentationPrep } =
      req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      employee: employeeId,      // employee ref
      assignedBy: req.user.id,   // 🔥 admin ref
      startDate,
      endDate,
      department: departmentId,   // ✅ SAVE DEPT
      codeReviewMeeting,
      clientPresentationPrep,
      status: "assigned",        // 🔥 DEFAULT STATUS
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ❌ REAL DELETE mat karo (refresh bug ka root)
// ✅ Soft delete (optional)
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.json({ message: "Task archived" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= EMPLOYEE ================= */

/* ================= EMPLOYEE ================= */

export const getEmployeeTasks = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const tasks = await Task.find({
      employee: employee._id,
      isDeleted: { $ne: true },
    })
      .populate("employee", "name email")
      .sort({ createdAt: -1 }); // ✅ NEW TASK FIRST

    res.json(tasks);
  } catch (err) {
    console.error("Get employee tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ ACCEPT TASK
export const acceptTask = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        employee: employee._id,
        status: "assigned",
      },
      { status: "accepted" },
      { new: true }
    );

    if (!task) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(task);
  } catch (err) {
    console.error("Accept task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ COMPLETE TASK
export const completeTask = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        employee: employee._id,
        status: "accepted",
      },
      { status: "completed" },
      { new: true }
    );

    if (!task) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(task);
  } catch (err) {
    console.error("Complete task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
