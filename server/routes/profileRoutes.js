import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getMyProfile,
  saveMyProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("employee"),
  getMyProfile
);

router.post(
  "/me",
  authMiddleware,
  roleMiddleware("employee"),
  saveMyProfile
);

export default router;
