import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default, ForeignKey,
    CreatedAt, UpdatedAt, AllowNull } from "sequelize-typescript";

import AffiliationSubmit from "./affiliationSubmit";

@Table
export default class Affiliation extends Model<Affiliation> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @AllowNull
    @ForeignKey(() => AffiliationSubmit)
    @Column(Sequelize.UUID)
    public activeSubmitId: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}
