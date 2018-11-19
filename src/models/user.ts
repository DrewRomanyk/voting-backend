import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Unique, IsEmail, Default, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table
export default class User extends Model<User> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @Unique
    @IsEmail
    @Column(Sequelize.TEXT)
    public email: string;

    @Unique
    @Column(Sequelize.TEXT)
    public username: string;

    @Column(Sequelize.TEXT)
    public password: string;

    @Column(Sequelize.TEXT)
    public sessionHash: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
