import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { Comment, CommentLike, Post, User, UserFollow } from "../models/index";

export async function postComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    console.log("PARAMS: ", req.params);

    const { postId } = req.params;
    const { comment } = req.body;
    const { userId } = req.user;

    if (!comment) {
        return next(new ApiError(400, "Comment message are required"));
    }

    try {
        const newComment = await Comment.create({
            postId,
            userId,
            comment
        });

        const commentWithUser = await Comment.findOne({
            where: { commentId: newComment.commentId },
            include: {
                model: User,
                attributes: ["userId", "username", "profilePicture", "fullName"],
            },
        });


        res.status(201).json({ comment: commentWithUser });
    } catch (error) {
        return next(new ApiError(500, "Failed to post comment"));
    }
}

export async function likeComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { commentId } = req.params;
    const { userId } = req.user;

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
        console.log(error);
        return next(new ApiError(500, "Failed to like comment"));
    }
}

export async function unlikeComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { commentId } = req.params;
    const { userId } = req.user;

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

export async function getCommentLikes(req: Request, res: Response, next: NextFunction) {
    const { commentId } = req.params;
    const currentUserId = req.user?.userId;

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return next(new ApiError(404, "Comment not found"));
        }

        const likes = await CommentLike.findAll({
            where: { commentId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["userId", "username", "fullName", "profilePicture"]
                }
            ]
        });

        const likedUserIds = likes
            .map((like: any) => like.user?.userId)
            .filter((id: string | undefined) => id && id !== currentUserId);

        let followingIds: string[] = [];
        if (currentUserId && likedUserIds.length > 0) {
            const followings = await UserFollow.findAll({
                where: {
                    followerId: currentUserId,
                    followingId: likedUserIds
                }
            });
            followingIds = followings.map((f: any) => f.followingId);
        }

        const likesWithIsFollowing = likes.map((like: any) => {
            const user = like.user?.toJSON ? like.user.toJSON() : like.user;
            return {
                ...user,
                isFollowing: user && currentUserId && user.userId !== currentUserId
                    ? followingIds.includes(user.userId)
                    : false
            };
        });

        res.status(200).json({ likes: likesWithIsFollowing });
    } catch (error) {
        return next(new ApiError(500, "Failed to fetch likes"));
    }
}

export async function editComment(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const { commentId } = req.params;
    const { comment } = req.body;
    const { userId } = req.user;

    if (!comment) {
        return next(new ApiError(400, "Comment is required"));
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
        const existingComment = await Comment.findByPk(commentId, {
            include: [
                {
                    model: Post,
                    as: "post",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["userId"]
                        }
                    ]
                }
            ]
        });

        if (!existingComment) {
            return next(new ApiError(404, "Comment not found"));
        }

        if (existingComment.post.user.userId !== userId && existingComment.userId !== userId) {
            return next(new ApiError(403, "You are not authorized to delete this comment"));
        }

        await existingComment.destroy();

        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Failed to delete comment"));
    }
}
