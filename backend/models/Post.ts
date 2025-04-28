import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from "./User";

@Table({
    tableName: "posts",
    timestamps: false,
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
}