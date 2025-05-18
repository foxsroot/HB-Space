import express from "express";
import { postComment, likeComment, unlikeComment, editComment, deleteComment } from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/comments", authenticateToken, postComment);
router.post("/comments/:commentId/like", authenticateToken, likeComment);
router.delete("/comments/:commentId/unlike", authenticateToken, unlikeComment);
router.put("/comments/:commentId", authenticateToken, editComment);
router.delete("/comments/:commentId", authenticateToken, deleteComment);

export default router;