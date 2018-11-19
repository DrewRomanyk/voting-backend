import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import Candidate from "./candidate";
import Issue from "./issue";
import PositionSubmit from "./positionSubmit";

@Table
export default class Position extends Model<Position> {
    @PrimaryKey
    @Column(Sequelize.UUID)
    @ForeignKey(() => Candidate)
    public candidateId: string;

    @PrimaryKey
    @Column(Sequelize.UUID)
    @ForeignKey(() => Issue)
    public issueId: string;

    @ForeignKey(() => PositionSubmit)
    @Column(Sequelize.UUID)
    public activeSubmitId: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
