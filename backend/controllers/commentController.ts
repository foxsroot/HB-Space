import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { Comment, CommentLike } from "../models/index";
import sequelize from "sequelize";

export async function getComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { postId } = req.params;

    try {
        const comments = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: CommentLike,
                    as: "likes",
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("likes.id")), "likesCount"]
                ]
            },
            group: ["Comment.id"]
        });

        res.status(200).json({ comments });
    } catch (error) {
        return next(new ApiError(500, "Failed to fetch comments"));
    }
}

export async function postComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { postId, comment } = req.body;
    const { userId } = req.user;

    if (!postId || !comment) {
        return next(new ApiError(400, "postId and comment message are required"));
    }

    try {
        const newComment = await Comment.create({
            postId,
            userId,
            comment
        });

        res.status(201).json({ comment: newComment });
    } catch (error) {
        return next(new ApiError(500, "Failed to post comment"));
    }
}

export async function likeComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { commentId } = req.body;
    const { userId } = req.user;

    if (!commentId) {
        return next(new ApiError(400, "commentId is required"));
    }

    try {
        const existingComment = await Comment.findByPk(commentId);

        if (!existingComment) {
            return next(new ApiError(404, "Comment not found"));
        }

        const alreadyLiked = await CommentLike.findOne({
            where: { commentId, userId }
        });

        if (alreadyLiked) {
            return next(new ApiError(409, "You have already liked this comment"));
        }

        const newLike = await CommentLike.create({
            commentId,
            userId
        });

        res.status(201).json({ message: "Comment liked", like: newLike });
    } catch (error) {
        return next(new ApiError(500, "Failed to like comment"));
    }
}

export async function unlikeComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { commentId } = req.params;
    const { userId } = req.user;

    if (!commentId) {
        return next(new ApiError(400, "commentId is required"));
    }

    try {
        const liked = await CommentLike.findOne({
            where: { commentId, userId }
        });

        if (!liked) {
            return next(new ApiError(404, "Like not found"));
        }

        await liked.destroy();

        res.status(200).json({ message: "Comment unliked" });
    } catch (error) {
        return next(new ApiError(500, "Failed to unlike comment"));
    }
}

export async function editComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { commentId } = req.params;
    const { comment } = req.body;
    const { userId } = req.user;

    if (!commentId || !comment) {
        return next(new ApiError(400, "commentId and comment are required"));
    }

    try {
        const existingComment = await Comment.findByPk(commentId);

        if (!existingComment) {
            return next(new ApiError(404, "Comment not found"));
        }

        if (existingComment.userId !== userId) {
            return next(new ApiError(403, "You are not authorized to edit this comment"));
        }

        existingComment.comment = comment;
        await existingComment.save();

        res.status(200).json({ message: "Comment updated", comment: existingComment });
    } catch (error) {
        return next(new ApiError(500, "Failed to update comment"));
    }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { commentId } = req.params;
    const { userId } = req.user;

    if (!commentId) {
        return next(new ApiError(400, "commentId is required"));
    }

    try {
        const existingComment = await Comment.findByPk(commentId);

        if (!existingComment) {
            return next(new ApiError(404, "Comment not found"));
        }

        if (existingComment.userId !== userId) {
            return next(new ApiError(403, "You are not authorized to delete this comment"));
        }

        await existingComment.destroy();

        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        return next(new ApiError(500, "Failed to delete comment"));
    }
}
