import { Comment, CommentLike } from "../models/index";
import sequelize from "sequelize";

export async function getComments(postId: string) {
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
                    [sequelize.fn("COUNT", sequelize.col("likes.comment_id")), "likesCount"]
                ]
            },
            group: ["Comment.comment_id"],
            order: [
                [sequelize.fn("COUNT", sequelize.col("likes.comment_id")), "DESC"],  // order by likesCount desc
                ['created_at', 'ASC']  // then by created_at ascending
            ]
        });

        if (comments) {
            comments.forEach(comment => {
                comment.setDataValue(
                    'likesCount',
                    parseInt(comment.getDataValue('likesCount') as string, 10) || 0
                );
            });
        }

        return { comments };
    } catch (error) {
        console.log(error);
        return {};
    }
}