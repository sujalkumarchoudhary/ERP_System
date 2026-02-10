import express from "express";
import Attendance from "../models/Attendance.js";

import {
  punchIn,
  punchOut,
  getMyAttendance,
  getActiveEmployees,
  getAttendanceStats,
} from "../controllers/attendanceController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ========= EMPLOYEE =========
router.post("/punch-in", authMiddleware, punchIn);
router.post("/punch-out", authMiddleware, punchOut);
router.get("/my", authMiddleware, getMyAttendance);


// ========= ADMIN ACTIVE EMPLOYEES =========
router.get("/active", authMiddleware, getActiveEmployees);
router.get("/stats", authMiddleware, getAttendanceStats);


export default router;
