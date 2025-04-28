import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
    tableName: "users",
    timestamps: false,
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
        allowNull: false,
        field: "profile_picture_path"
    })
    declare profilePicture: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "full_name"
    })
    declare fullName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
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
}