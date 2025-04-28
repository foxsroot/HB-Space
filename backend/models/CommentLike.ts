import { Table, Model, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { Comment } from './Comment';
import { User } from './User';

@Table({
    tableName: "comments_likes",
    timestamps: false,
    createdAt: false,
    updatedAt: false
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

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: "timestamp"
    })
    declare timestamp: Date;
}