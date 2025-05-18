import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from "./User";
import { PostLike } from "./PostLike";
import { Comment } from "./Comment";

@Table({
    tableName: "posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export class Post extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "post_id"
    })
    declare postId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "image_file_path"
    })
    declare image: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare caption: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: "user_id",
        allowNull: false
    })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;

    @HasMany(() => PostLike)
    declare likes: PostLike[];

    @HasMany(() => Comment)
    declare comments: Comment[];
}