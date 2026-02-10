import express from "express";
import {
  getAdminTasks,
  createTask,
  deleteTask,
  getEmployeeTasks,
  acceptTask,
  completeTask,
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= ADMIN ================= */

// 🔥 ADMIN TASKS (FIX)
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminTasks
);

// Create task
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTask
);

// Delete task
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteTask
);

/* ================= EMPLOYEE ================= */

// Get own tasks
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("employee"),
  getEmployeeTasks
);

// Accept task
router.put(
  "/:id/accept",
  authMiddleware,
  roleMiddleware("employee"),
  acceptTask
);

// Complete task
router.put(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("employee"),
  completeTask
);

export default router;
