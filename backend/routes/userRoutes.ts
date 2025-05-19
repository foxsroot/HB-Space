import express from "express";
import {
  getUser,
  getUserById,
  updateUser,
  changePassword,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { uploadSingleImage } from "../middlewares/multerMiddleware";

const router = express.Router();

// Route to get the current user's profile
router.get("/", authenticateToken, getUser);

// Route to get a profile by ID
router.get("/:id", authenticateToken, getUserById);

// Route to update an existing profile
router.put("/", authenticateToken, uploadSingleImage, updateUser);

// Route to change password
router.post("/change-password", authenticateToken, changePassword);

export default router;