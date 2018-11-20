import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, IsUrl, Default,
    ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import { ILocalizedStrings, ISubmitStatus } from "./../utilities/models";
import Affiliation from "./affiliation";
import Candidate from "./candidate";
import User from "./user";

@Table
export default class CandidateSubmit extends Model<CandidateSubmit> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @ForeignKey(() => Candidate)
    @Column(Sequelize.UUID)
    public candidateId: string;

    @Column(Sequelize.TEXT)
    public name: string;

    @Column(Sequelize.JSONB)
    public description: ILocalizedStrings;

    @Column(Sequelize.JSONB)
    public occupation: ILocalizedStrings;

    @ForeignKey(() => Affiliation)
    @Column(Sequelize.UUID)
    public affiliationId: string;

    @Column(Sequelize.DATE)
    public dateOfBirth: Date;

    @IsUrl
    @Column(Sequelize.TEXT)
    public websiteUrl: string;

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
