import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { PostLike } from './PostLike';
import { Post } from './Post';
import { Comment } from './Comment';
import { CommentLike } from './CommentLike';
import { UserFollow } from './UserFollow';

@Table({
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export class User extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "user_id"
    })
    declare userId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: "profile_picture_path"
    })
    declare profilePicture: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: "full_name"
    })
    declare fullName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare bio: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare country: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare birthdate: Date;

    @HasMany(() => PostLike)
    declare likes: PostLike[];

    @HasMany(() => Post)
    declare posts: Post[];

    @HasMany(() => Comment)
    declare comments: Comment[];

    @HasMany(() => CommentLike)
    declare commentLikes: CommentLike[];

    @HasMany(() => UserFollow, 'followerId')
    declare followings: UserFollow[]; 

    @HasMany(() => UserFollow, 'followingId')
    declare followers: UserFollow[]; 
}