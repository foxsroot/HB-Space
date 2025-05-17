import express from "express";
import {
  getUser,
  getUserById,
  updateUser,
  // createUser,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Route to get the current user's profile
router.get("/", authenticateToken, getUser);

// Route to get a profile by ID
router.get("/:id", getUserById);

// Route to create a new profile
// router.post("/", createUser);

// Route to update an existing profile
router.put("/", authenticateToken, updateUser);

export default router;