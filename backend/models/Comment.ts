import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';

@Table({
    tableName: "comments",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class Comment extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "comment_id"
    })
    declare commentId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: "user_id",
        allowNull: false
    })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.UUID,
        field: "post_id",
        allowNull: false
    })
    declare postId: string;

    @BelongsTo(() => Post)
    declare post: Post;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare comment: string;
}