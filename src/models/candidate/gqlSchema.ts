import { gql, IResolvers } from "apollo-server-express";

import { IGraphQlContext } from "../../app";
import * as Candidate from "./";

export const typeDefs = gql`
    type Candidate {
        id: ID!
        name: String!
        date_of_birth: String!
        website_url: String
    }

    extend type Query {
        candidateAll: [Candidate]!
        candidateById(id: String!): Candidate!
    }

    extend type Mutation {
        candidateCreate(username: String!, password: String!): Candidate!
        candidateUpdate(email: String!, username: String!, password: String!): Candidate!
        candidateRemove(id: String!): ID!
    }
`;

export const resolver: IResolvers = {
    Query: {
        async candidateById(_, { id }, __: IGraphQlContext) {
            try {
                const candidate = await Candidate.findById(id);
                return candidate;
            } catch (e) {
                throw new Error("Failed getting data");
            }
        },
        async candidateAll(_, __, ___: IGraphQlContext) {
            try {
                const candidates = await Candidate.findAll();
                return candidates;
            } catch (e) {
                throw new Error("Failed getting data");
            }
        },
    },
    Mutation: {
        async candidateCreate(_, { name, affiliationId, dateOfBirth, websiteUrl, submitStatus, submitUserId }) {
            try {
                const candidate = await Candidate.create({
                    name,
                    affiliationId,
                    dateOfBirth,
                    websiteUrl,
                    submitStatus,
                    submitUserId,
                });
                return candidate;
            } catch (e) {
                throw new Error("Failed at creating candidate");
            }
        },
        async candidateUpdate(_, { id, name, affiliationId, dateOfBirth, websiteUrl, submitStatus, submitUserId }) {
            try {
                const candidate = await Candidate.update({
                    id,
                    name,
                    affiliationId,
                    dateOfBirth,
                    websiteUrl,
                    submitStatus,
                    submitUserId,
                });
                return candidate;
            } catch (e) {
                throw new Error("Failed at updating candidate");
            }
        },
        async candidateRemove(_, { id }) {
            try {
                await Candidate.remove(id);
                return id;
            } catch (e) {
                throw new Error("Failed at updating candidate");
            }
        },
    },
};
