import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import CandidateSubmit from "./candidateSubmit";

@Table
export default class Candidate extends Model<Candidate> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @ForeignKey(() => CandidateSubmit)
    @Column(Sequelize.UUID)
    public activeSubmitId: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
