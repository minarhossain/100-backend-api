import express from "express";
import {
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// Protected route update profile

router.put("/profile", authMiddleware, updateProfile);
