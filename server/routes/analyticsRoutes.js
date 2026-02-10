import express from "express";
import {
  monthlySales,
  yearlySales,
} from "../controllers/analyticsController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * ANALYTICS
 * ADMIN ONLY
 */

// Monthly sales analytics
router.get(
  "/monthly",
  authMiddleware,
  roleMiddleware("admin"),
  monthlySales
);

// Yearly sales analytics
router.get(
  "/yearly",
  authMiddleware,
  roleMiddleware("admin"),
  yearlySales
);

export default router;
