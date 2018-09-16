import { gql, IResolvers } from "apollo-server-express";

import { IGraphQlContext } from "../../app";
import * as Candidate from "./";

export const typeDefs = gql`
    type Candidate {
        id: ID!
        name: String!
        date_of_birth: String!
        website_url: String
        submit_status: Int!
        submit_user_id: String!
        submit_datetime: String!
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
                console.log(candidate);
                console.log(typeof candidate.date_of_birth);
                console.log(Object.keys(candidate.date_of_birth.toString()));
                console.log(candidate.date_of_birth.toString());
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
        async candidateCreate(_, { name, partyId, dateOfBirth, websiteUrl, submitStatus, submitUserId }) {
            try {
                const candidate = await Candidate.create({
                    name,
                    partyId,
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
        async candidateUpdate(_, { id, name, partyId, dateOfBirth, websiteUrl, submitStatus, submitUserId }) {
            try {
                const candidate = await Candidate.update({
                    id,
                    name,
                    partyId,
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
