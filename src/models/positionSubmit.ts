import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default,
    ForeignKey, CreatedAt, UpdatedAt, IsUrl } from "sequelize-typescript";

import Candidate from "./candidate";
import Issue from "./issue";
import User from "./user";

@Table
export default class PositionSubmit extends Model<PositionSubmit> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @ForeignKey(() => Candidate)
    @Column(Sequelize.UUID)
    public candidateId: string;

    @ForeignKey(() => Issue)
    @Column(Sequelize.UUID)
    public issueId: string;

    @Column(Sequelize.BOOLEAN)
    public currentPosition: boolean;

    @IsUrl
    @Column(Sequelize.TEXT)
    public sourceQuote: string;

    @Column(Sequelize.TEXT)
    public sourceUrl: string;

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
