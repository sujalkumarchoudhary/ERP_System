import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import Department from "../models/Department.js";
import User from "../models/User.js";

/* ================= GET ALL ================= */
export const getEmployees = async (req, res) => {
  try {
    const { page, limit } = req.query;

    if (page && limit) {
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const total = await Employee.countDocuments();
      const employees = await Employee.find()
        .populate("department", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        data: employees,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      });
    }

    // Default: Return all (Backward Compatibility)
    const employees = await Employee.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE ================= */
export const createEmployee = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      status,
      ...rest
    } = req.body;

    const emailNormalized = email.trim().toLowerCase();

    // Check if login user already exists
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Create login user (for auth)
    const user = await User.create({
      email: emailNormalized,
      password: hashedPassword,
      role: "employee",
    });

    // Create employee profile
    const employee = await Employee.create({
      ...rest,
      email: emailNormalized,
      role,
      status,
      user: user._id,
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error("Create employee error:", err);
    res.status(500).json({ message: "Create employee failed" });
  }
};

/* ================= UPDATE ================= */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Also delete the linked auth User to prevent orphaned credentials
    if (employee.user) {
      await User.findByIdAndDelete(employee.user);
    }

    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

