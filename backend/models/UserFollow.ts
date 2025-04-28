import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from "./User";

@Table({
    tableName: "user_follows",
    timestamps: false
})

export class UserFollow extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        field: "follower_id"
    })
    declare followerId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        field: "following_id"
    })
    declare followingId: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare timestamp: Date;

    @BelongsTo(() => User, 'followerId')
    declare follower: User;

    @BelongsTo(() => User, 'followingId')
    declare following: User;
}