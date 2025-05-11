import express from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { uploadSingleImage } from "../middlewares/multerMiddleware";

const router = express.Router();

router.get("/", getAllPosts);

router.post("/", authenticateToken, uploadSingleImage, createPost);

router.get("/:postId", getPostById);

router.put("/:postId", authenticateToken, uploadSingleImage, updatePost);

router.delete("/:postId", authenticateToken, deletePost);

export default router;