import express from "express";
import { postComment, getCommentLikes, likeComment, unlikeComment, editComment, deleteComment } from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router({ mergeParams: true });

router.post("/", authenticateToken, postComment);
router.get("/:commentId/like", authenticateToken, getCommentLikes);
router.post("/:commentId/like", authenticateToken, likeComment);
router.delete("/:commentId/like", authenticateToken, unlikeComment);
router.put("/:commentId", authenticateToken, editComment);
router.delete("/:commentId", authenticateToken, deleteComment);

export default router;