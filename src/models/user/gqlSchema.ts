import { gql, IResolvers } from "apollo-server-express";

import { IGraphQlContext } from "../../app";
import * as User from "./";

export const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        username: String!
        role_id: ID!
        session_hash: String!
    }

    extend type Query {
        me: User!
    }

    extend type Mutation {
        login(username: String!, password: String!): String!
        signup(email: String!, username: String!, password: String!): String!
    }
`;

export const resolver: IResolvers = {
    Query: {
        async me(_, __, context: IGraphQlContext): Promise<User.IUser> {
            return User.findById(context.user.id);
        },
    },
    Mutation: {
        async login(_, { username, password }): Promise<string> {
            return User.findByUsername(username)
            .then((user) => User.verifyPassword(user, password))
            .then((user) => User.getJwt(user.id, user.session_hash));
        },
        async signup(_, { email, username, password }): Promise<string> {
            return User.signup(email, username, password)
            .then((user) => User.getJwt(user.id, user.session_hash));
        },
    },
};
