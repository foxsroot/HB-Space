import { Comment, CommentLike, User } from "../models/index";
import sequelize from "sequelize";

export async function getComments(postId: string, userId?: string) {
    try {
        const comments = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: CommentLike,
                    as: "likes",
                    attributes: [],
                },
                {
                    model: User,
                    as: "user",
                    attributes: ['userId', 'username', 'profilePicture', 'fullName']
                }
            ],
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("likes.comment_id")), "likesCount"],
                ]
            },
            group: ["Comment.comment_id", "user.user_id"],
            order: [
                [sequelize.fn("COUNT", sequelize.col("likes.comment_id")), "DESC"],
                ['created_at', 'ASC']
            ]
        });

        if (comments) {
            for (const comment of comments) {
                comment.setDataValue(
                    'likesCount',
                    parseInt(comment.getDataValue('likesCount') as string, 10) || 0
                );
                // Add isLiked for the current user
                let isLiked = false;
                if (userId) {
                    const like = await CommentLike.findOne({
                        where: { commentId: comment.commentId, userId }
                    });
                    if (like) {
                        isLiked = true;
                    } else {
                        isLiked = false;
                    }
                }
                comment.setDataValue('isLiked', isLiked);
            }
        }

        return { comments };
    } catch (error) {
        console.log(error);
        return {};
    }
}