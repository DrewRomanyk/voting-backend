import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import { ILocalizedStrings, ISubmitStatus } from "./../utilities/models";
import Issue from "./issue";
import Topic from "./topic";
import User from "./user";

@Table
export default class IssueSubmit extends Model<IssueSubmit> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @ForeignKey(() => Issue)
    @Column(Sequelize.UUID)
    public issueId: string;

    @ForeignKey(() => Topic)
    @Column(Sequelize.UUID)
    public topicId: string;

    @Column(Sequelize.JSONB)
    public name: ILocalizedStrings;

    @Column(Sequelize.INTEGER)
    public submitStatus: ISubmitStatus;

    @ForeignKey(() => User)
    @Column(Sequelize.UUID)
    public submitUserId: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
