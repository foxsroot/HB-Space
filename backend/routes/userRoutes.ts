import express from "express";
import {
  getUser,
  getUserById,
  updateUser,
  changePassword,
  getFollowers,
  getFollowings,
  followUser,
  unfollowUser,
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

// Route to get the current list user's followers
router.get("/:userId/followers", authenticateToken, getFollowers);

// Route to get the current list user's following
router.get("/:userId/followings", authenticateToken, getFollowings);

// Route to get the current user's followers
router.post("/:userId/followers", authenticateToken, followUser);

// Route to get the current user's following
router.delete("/:userId/followers", authenticateToken, unfollowUser);

export default router;