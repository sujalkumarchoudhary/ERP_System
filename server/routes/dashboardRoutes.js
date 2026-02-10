import express from "express";
import {
  getMyProfile,
  getStats,
  getChartsData,
  getRecentSales
} from "../controllers/dashboardController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * ADMIN DASHBOARD ROUTES
 * Only admin can access dashboard analytics
 */

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("admin"),
  getMyProfile
);

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getStats
);

router.get(
  "/charts",
  authMiddleware,
  roleMiddleware("admin"),
  getChartsData
);

router.get(
  "/recent-sales",
  authMiddleware,
  roleMiddleware("admin"),
  getRecentSales
);



export default router;
