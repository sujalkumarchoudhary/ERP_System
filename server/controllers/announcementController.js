import Announcement from "../models/Announcement.js";
import Employee from "../models/Employee.js";

/* ================= CREATE (ADMIN) ================= */
export const createAnnouncement = async (req, res) => {
  try {
    const { message, departmentId } = req.body;

    if (!message || !departmentId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const announcement = await Announcement.create({
      message,
      department: departmentId,
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL (ADMIN) ================= */
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error("Get all announcements error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET EMPLOYEE (DEPARTMENT WISE) ================= */
export const getEmployeeAnnouncements = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const announcements = await Announcement.find({
      department: employee.department,
    })
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error("Get employee announcements error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE (ADMIN) ================= */
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
