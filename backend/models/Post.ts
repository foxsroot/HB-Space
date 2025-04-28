import { Table, Model, Column, DataType } from 'sequelize-typescript';

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
        field: "post_id"
    })    
    declare postId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "image_file_path"
    })
    declare imageFile: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare caption: string;
}