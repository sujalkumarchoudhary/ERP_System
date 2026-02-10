import express from "express";
import {
  getDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
  getDepartmentEmployees
} from "../controllers/departmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * DEPARTMENT MANAGEMENT
 * ADMIN ONLY
 */

// Get all departments
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getDepartments
);

// Create department
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createDepartment
);

// Update department
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateDepartment
);

// Delete department
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteDepartment
);

// Get employees of a department (popup)
router.get(
  "/:id/employees",
  authMiddleware,
  roleMiddleware("admin"),
  getDepartmentEmployees
);

export default router;
