import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default,
    ForeignKey, CreatedAt, UpdatedAt, AllowNull } from "sequelize-typescript";

import TopicSubmit from "./topicSubmit";

@Table
export default class Topic extends Model<Topic> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @AllowNull
    @ForeignKey(() => TopicSubmit)
    @Column(Sequelize.UUID)
    public activeSubmitId: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
