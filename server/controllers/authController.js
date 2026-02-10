import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailNormalized = email.trim().toLowerCase();

    // 🔍 1. Find USER (NOT employee)
    const user = await User.findOne({ email: emailNormalized });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔑 3. Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};


/* ================= EMPLOYEE LOGIN ================= */

export const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailNormalized = email.trim().toLowerCase();

    // 1️⃣ USER find karo
    const user = await User.findOne({
      email: emailNormalized,
      role: "employee",
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2️⃣ PASSWORD match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ EMPLOYEE find karo (NAME ke liye)
    const employee = await Employee.findOne({ user: user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    // 4️⃣ JWT with NAME
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: employee.name, // ✅ IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Employee login error:", err);
    res.status(500).json({ message: "Employee login failed" });
  }
};
