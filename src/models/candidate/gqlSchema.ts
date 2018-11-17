import { gql, IResolvers } from "apollo-server-express";

import { IGraphQlContext } from "../../app";
import { IBase, IId, ILocalizedStringEntry, ISubmitBase } from "../../utilities/models";
import * as Candidate from "./";

export const typeDefs = gql`
    type Candidate {
        id: ID!
        currentSubmitId: ID!

        currentSubmit: CandidateSubmit!
        submits: [CandidateSubmit!]!
    }

    type CandidateSubmit {
        id: ID!
        submitId: ID!

        name: String!
        allDescriptions: [LocalizedString!]!
        description(language: String!): String
        allOccupations: [LocalizedString!]!
        occupation(language: String!): String
        affiliationId: ID!
        dateOfBirth: String!
        websiteUrl: String
        submitStatus: Int!
        submitUserId: ID!
    }

    type LocalizedString {
        language: String!
        value: String!
    }

    extend type Query {
        candidateAll: [Candidate!]!
        candidateById(id: String!): Candidate!
    }

    extend type Mutation {
        candidateCreate(
            name: String!, affiliationId: ID!,
            dateOfBirth: String!, websiteUrl: String, submitStatus: String!, submitUserId: ID!): Candidate!
        candidateSubmit(id: ID!,
            name: String!, affiliationId: ID!,
            dateOfBirth: String!, websiteUrl: String, submitStatus: String!, submitUserId: ID!): Candidate!
        candidateActivateSubmit(id: ID!, submitId: ID!): Candidate!
        candidateRemove(id: ID!): ID!
        candidateRemoveSubmit(id: ID!, submitId: ID!): ID!
    }
`;

export const resolver: IResolvers = {
    Query: {
        async candidateById(_, args: IId, __: IGraphQlContext)
                : Promise<IBase> {
            return Candidate.get(args.id);
        },
        async candidateAll(_, __, ___: IGraphQlContext): Promise<IBase[]> {
            return Candidate.getAll();
        },
    },
    Candidate: {
        async currentSubmit(candidate: IBase, _, __: IGraphQlContext): Promise<Candidate.ICandidateSubmit> {
            console.log("currentSubmit", candidate);
            return Candidate.getSubmit(candidate.currentSubmitId);
        },
        async submits(candidate: IBase, _, __: IGraphQlContext): Promise<Candidate.ICandidateSubmit[]> {
            return Candidate.getAllSubmitForCandidate(candidate.id);
        },
    },
    CandidateSubmit: {
        async allDescriptions(candidateSubmit: Candidate.ICandidateSubmit, _, __: IGraphQlContext)
                : Promise<ILocalizedStringEntry[]> {
            return Object.entries(candidateSubmit.description).map<ILocalizedStringEntry>((entry) => ({
                language: entry[0],
                value: entry[1],
            }));
        },
        async description(candidateSubmit: Candidate.ICandidateSubmit, { language }, __: IGraphQlContext)
                : Promise<string> {
            return candidateSubmit.description[language];
        },
        async allOccupations(candidateSubmit: Candidate.ICandidateSubmit, _, __: IGraphQlContext)
                : Promise<ILocalizedStringEntry[]> {
            return Object.entries(candidateSubmit.occupation).map<ILocalizedStringEntry>((entry) => ({
                language: entry[0],
                value: entry[1],
            }));
        },
        async occupation(candidateSubmit: Candidate.ICandidateSubmit, { language }, __: IGraphQlContext)
                : Promise<string> {
            return candidateSubmit.occupation[language];
        },
    },
    Mutation: {
        async candidateCreate(_, args: Partial<Candidate.ICandidateSubmit>)
                : Promise<IBase> {
            return Candidate.create(args);
        },
        async candidateSubmit(_, args: Candidate.ICandidateSubmit)
                : Promise<Candidate.ICandidateSubmit> {
            return Candidate.update(args);
        },
        async candidateActivateSubmit(_, args: ISubmitBase)
                : Promise<Candidate.ICandidateSubmit> {
            return Candidate.update(args);
        },
        async candidateRemove(_, args: IId): Promise<string> {
            return Candidate.remove(args.id);
        },
        async candidateRemoveSubmit(_, args: ISubmitBase): Promise<string> {
            return Candidate.remove(args.id);
        },
    },
};
