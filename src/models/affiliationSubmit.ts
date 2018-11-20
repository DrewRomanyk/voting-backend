import * as Sequelize from "sequelize";
import { Column, Model, PrimaryKey, Table, Default, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import { ILocalizedStrings, ISubmitStatus } from "./../utilities/models";
import Affiliation from "./affiliation";
import User from "./user";

@Table
export default class AffiliationSubmit extends Model<AffiliationSubmit> {
    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public id: string;

    @ForeignKey(() => Affiliation)
    @Column(Sequelize.UUID)
    public affiliationId: string;

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
