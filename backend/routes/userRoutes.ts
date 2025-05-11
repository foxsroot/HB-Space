import express from "express";
import {
  getProfile,
  getProfileById,
  updateProfile,
  createProfile,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Route to get the current user's profile
router.get("/", authenticateToken, getProfile);

// Route to get a profile by ID
router.get("/:id", getProfileById);

// Route to create a new profile
router.post("/", createProfile);

// Route to update an existing profile
router.put("/", authenticateToken, updateProfile);

export default router;