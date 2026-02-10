import express from "express";
import {
  createSale,
  getSales,
  updateSale,
  deleteSale
} from "../controllers/salesController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * SALES MANAGEMENT
 * ADMIN ONLY
 */

// Get all sales
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getSales
);

// Create sale
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSale
);

// Update sale
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateSale
);

// Delete sale
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSale
);

export default router;
