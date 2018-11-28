import { Sequelize } from "sequelize-typescript";

import ajv from "../utilities/localAjv";
import Category from "../models/category";
import { ILocalizedStrings, ISubmitStatus } from "../utilities/models";
import CategorySubmit from "../models/categorySubmit";

export interface ISubmitCategory {
    name: ILocalizedStrings;
    submitUserId: string;
}

const createValidate = ajv.compile({
    $async: true,
    type: "object",
    required: ["name", "submitUserId"],
    additionalProperties: false,
    properties: {
        name: {
            type: "object",
            patternProperties: {
                "*": { type: "string" },
            },
        },
        submitUserId: {
            type: "string",
            format: "uuid",
        },
    },
});

export default class CategoryService {
    public static async create(sequelize: Sequelize, data: ISubmitCategory): Promise<Category> {
        return (createValidate(data) as Promise<ISubmitCategory>)
        .then(() => sequelize.transaction((transaction) => {
            let categoryCreated: Category;
            return Category.create({}, { transaction })
            .then((category) => {
                categoryCreated = category;
                return CategorySubmit.create({
                    categoryId: category.id,
                    name: data.name,
                    submitStatus: ISubmitStatus.Pending,
                    submitUserId: data.submitUserId,
                }, { transaction });
            }).then((categorySubmit) => {
                categoryCreated.activeSubmitId = categorySubmit.id;
                return categoryCreated.save({ transaction });
            });
        }));
    }

    public static async submit(categoryId: string, data: ISubmitCategory): Promise<CategorySubmit> {
        return (createValidate(data) as Promise<ISubmitCategory>)
        .then(() => this.get(categoryId))
        .then(() => CategorySubmit.create({
            categoryId,
            name: data.name,
            submitStatus: ISubmitStatus.Pending,
            submitUserId: data.submitUserId,
        }));
    }

    public static async updateSubmit(id: string, data: ISubmitCategory): Promise<CategorySubmit> {
        return (createValidate(data) as Promise<ISubmitCategory>)
        .then(() => this.getSubmit(id))
        .then((categorySubmit) => {
            if (categorySubmit.submitStatus === ISubmitStatus.Approved) {
                throw new Error("Cannot update an approved submit");
            }
            categorySubmit.name = data.name;
            categorySubmit.submitStatus = ISubmitStatus.Pending;
            return categorySubmit.save();
        });
    }

    public static async approve(sequelize: Sequelize, submitId: string): Promise<CategorySubmit> {
        return sequelize.transaction((transaction) => {
            let categorySubmitToApprove: CategorySubmit;
            return CategorySubmit.findByPk(submitId, { transaction })
            .then((categorySubmit) => {
                if (categorySubmit.submitStatus !== ISubmitStatus.Review &&
                        categorySubmit.submitStatus !== ISubmitStatus.Approved) {
                    throw new Error("Category submit is not in review");
                }
                categorySubmit.submitStatus = ISubmitStatus.Approved;
                return categorySubmit.save({ transaction });
            }).then((categorySubmit) => {
                categorySubmitToApprove = categorySubmit;
                return Category.findByPk(categorySubmit.categoryId, { transaction });
            }).then((category) => {
                category.activeSubmitId = submitId;
                return category.save({ transaction });
            }).then(() => categorySubmitToApprove);
        });
    }

    public static async reject(submitId: string): Promise<CategorySubmit> {
        let categorySubmitToReject: CategorySubmit;
        return CategorySubmit.findByPk(submitId)
        .then((categorySubmit) => {
            categorySubmitToReject = categorySubmit;
            return Category.findByPk(categorySubmit.categoryId);
        }).then((category) => {
            if (category.activeSubmitId === categorySubmitToReject.id) {
                throw new Error("Cannot reject active submit");
            }
            categorySubmitToReject.submitStatus = ISubmitStatus.Rejected;
            return categorySubmitToReject.save();
        });
    }

    public static async review(submitId: string): Promise<CategorySubmit> {
        return this.getSubmit(submitId)
        .then((categorySubmit) => {
            if (categorySubmit.submitStatus !== ISubmitStatus.Pending) {
                throw new Error("Category submit is not pending");
            }
            categorySubmit.submitStatus = ISubmitStatus.Review;
            return categorySubmit.save();
        });
    }

    public static async getAll(): Promise<Category[]> {
        return Category.findAll();
    }

    public static async get(id: string): Promise<Category> {
        return Category.findByPk(id);
    }

    public static async getAllSubmitForCategory(categoryId: string): Promise<CategorySubmit[]> {
        return CategorySubmit.findAll({ where: { categoryId } });
    }

    public static async getSubmit(id: string): Promise<CategorySubmit> {
        return CategorySubmit.findByPk(id);
    }
}
