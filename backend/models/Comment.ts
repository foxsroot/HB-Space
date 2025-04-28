import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
    tableName: "users",
    timestamps: false,
    createdAt: "uploaded_at",
    updatedAt: "edited_at"
})

export class User extends Model {
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
    

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: "post_id",
        allowNull: false
    })
    declare postId: string;

    @BelongsTo(() => User)
    declare post: User;
    
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare comment: string;
}