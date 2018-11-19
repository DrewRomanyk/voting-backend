import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import { ILocalizedStrings } from "./../utilities/models";
import Category from "./category";
import Topic from "./topic";
import User from "./user";

@Table
export default class TopicSubmit extends Model<TopicSubmit> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @ForeignKey(() => Topic)
    @Column(Sequelize.UUID)
    public topicId: string;

    @ForeignKey(() => Category)
    @Column(Sequelize.UUID)
    public categoryId: string;

    @Column(Sequelize.JSONB)
    public name: ILocalizedStrings;

    @Column(Sequelize.INTEGER)
    public submitStatus: number;

    @ForeignKey(() => User)
    @Column(Sequelize.UUID)
    public submitUserId: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
