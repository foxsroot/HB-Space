import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Comment } from './Comment';
import { User } from './User';

@Table({
    tableName: "comment_likes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class CommentLike extends Model {
    @ForeignKey(() => Comment)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        field: "comment_id"
    })
    declare commentId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        field: "user_id"
    })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Comment)
    declare comment: Comment;
}