import express from "express";
import { login, employeeLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

// EMPLOYEE LOGIN ✅
router.post("/employee/login", employeeLogin);

export default router;
