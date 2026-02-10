import Profile from "../models/Profile.js";
import Employee from "../models/Employee.js";

// GET LOGGED-IN EMPLOYEE PROFILE
export const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id })
      .populate("department");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const profile = await Profile.findOne({
      employeeId: employee._id,
    });

    res.json({
      employee,
      profile,
    });
  } catch (error) {
    console.error("Get my profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// SAVE / UPDATE OWN PROFILE
export const saveMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const profile = await Profile.findOneAndUpdate(
      { employeeId: employee._id },
      { ...req.body, employeeId: employee._id },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    console.error("Save my profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   ADMIN (Manage any employee profile)
   ===================================================== */

// ✅ ADMIN: GET ANY EMPLOYEE PROFILE
export const getEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId).populate("department");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const profile = await Profile.findOne({ employeeId });

    res.json({
      employee,
      profile: profile || {},
    });
  } catch (error) {
    console.error("Admin get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ADMIN: SAVE / UPDATE ANY EMPLOYEE PROFILE
export const saveEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const profile = await Profile.findOneAndUpdate(
      { employeeId },
      { ...req.body, employeeId },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    console.error("Admin save profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
