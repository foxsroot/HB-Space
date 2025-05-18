import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';

@Table({
    tableName: "post_likes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class PostLike extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        field: "user_id"
    })
    declare userId: string;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        field: "post_id"
    })
    declare postId: string;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Post)
    declare post: Post;
}
