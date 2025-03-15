import express from "express";
import { registerUser } from "../controllers/authController.js";

export const router = express.Router();

router.post("/register", registerUser);
