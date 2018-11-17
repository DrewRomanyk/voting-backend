import { gql, IResolvers } from "apollo-server-express";

import { IGraphQlContext } from "../../app";
import { IId } from "../../utilities/models";
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
        candidateCreate(name: String!, partyId: ID!, dateOfBirth: String!,
            websiteUrl: String, submitStatus: String!, submitUserId: ID!): Candidate!
        candidateUpdate(id: ID, name: String!, partyId: ID!, dateOfBirth: String!,
            websiteUrl: String, submitStatus: String!, submitUserId: ID!): Candidate!
        candidateRemove(id: String!): ID!
    }
`;

export const resolver: IResolvers = {
    Query: {
        async candidateById(_, args: IId, __: IGraphQlContext)
                : Promise<Candidate.ICandidate> {
            return Candidate.findById(args.id);
        },
        async candidateAll(_, __, ___: IGraphQlContext): Promise<Candidate.ICandidate[]> {
            return Candidate.findAll();
        },
    },
    Mutation: {
        async candidateCreate(_, args: Partial<Candidate.ICandidate>)
                : Promise<Candidate.ICandidate> {
            return Candidate.create(args);
        },
        async candidateUpdate(_, args: Candidate.ICandidate)
                : Promise<Candidate.ICandidate> {
            return Candidate.update(args);
        },
        async candidateRemove(_, args: IId): Promise<string> {
            return Candidate.remove(args.id);
        },
    },
};
