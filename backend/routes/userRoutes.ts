import express from "express";
import {
  getUserByUsername,
  updateUser,
  changePassword,
  getFollowers,
  getFollowings,
  followUser,
  unfollowUser,
  getUser,
  searchUsers
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { uploadSingleImage } from "../middlewares/multerMiddleware";

const router = express.Router();

router.get("/", authenticateToken, getUser);

router.get("/search", authenticateToken, searchUsers);

// Route to get a profile by username
router.get("/:username", authenticateToken, getUserByUsername);

// Route to update an existing profile
router.put("/", authenticateToken, uploadSingleImage, updateUser);

// Route to change password
router.post("/change-password", authenticateToken, changePassword);

// Route to get the current list user's followers
router.get("/:userId/followers", authenticateToken, getFollowers);

// Route to get the current list user's following
router.get("/:userId/followings", authenticateToken, getFollowings);

// Route to follow a user
router.post("/:userId/followers", authenticateToken, followUser);

// Route to get the current user's following
router.delete("/:userId/followers", authenticateToken, unfollowUser);

export default router;