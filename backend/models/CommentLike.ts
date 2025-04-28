import { Table, Model, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { Comment } from './Comment';
import { User } from './User';

@Table({
    tableName: "comment_likes",
    timestamps: true
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
        defaultValue: DataType.NOW
    })
    declare timestamp: Date;
}