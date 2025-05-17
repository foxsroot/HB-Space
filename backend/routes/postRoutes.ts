import express from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getLikeCount,
  getLikes
} from "../controllers/postController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { uploadSingleImage } from "../middlewares/multerMiddleware";

const router = express.Router();

router.get("/", authenticateToken, getAllPosts);

router.post("/", authenticateToken, uploadSingleImage, createPost);

router.get("/:postId", authenticateToken, getPostById);

router.put("/:postId", authenticateToken, uploadSingleImage, updatePost);

router.delete("/:postId", authenticateToken, deletePost);

router.post("/:postId/like", authenticateToken, likePost);

router.get("/:postId/like", authenticateToken, getLikes);


export default router;