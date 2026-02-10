import express from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * EMPLOYEE MANAGEMENT
 * ADMIN ONLY
 */

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getEmployees
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createEmployee
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateEmployee
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteEmployee
);

export default router;
