import express from "express";
import {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  getEmployeeAnnouncements,
} from "../controllers/announcementController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= ADMIN ================= */

// Admin → create announcement
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createAnnouncement
);

// Admin → delete announcement
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAnnouncement
);

// Admin → get ALL announcements
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllAnnouncements
);

/* ================= EMPLOYEE ================= */

// Employee → get department-wise announcements
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("employee"),
  getEmployeeAnnouncements
);


export default router;
