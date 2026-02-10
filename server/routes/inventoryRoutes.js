import express from "express";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/inventoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * INVENTORY MANAGEMENT
 * ADMIN ONLY
 */

// Get all inventory items
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getItems
);

// Create inventory item
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createItem
);

// Update inventory item
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateItem
);

// Delete inventory item
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteItem
);

export default router;
