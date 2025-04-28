import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';

@Table({
    tableName: "post_likes",
    timestamps: false
})
export class PostLike extends Model<PostLike> {
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

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare timestamp: Date;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Post)
    declare post: Post;
}
