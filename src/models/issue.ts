import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import IssueSubmit from "./issueSubmit";

@Table
export default class Issue extends Model<Issue> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @ForeignKey(() => IssueSubmit)
    @Column(Sequelize.UUID)
    public activeSubmitId: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
