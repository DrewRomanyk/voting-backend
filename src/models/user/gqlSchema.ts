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
            const user: User.IJwtPayload = context.user;
            if (!user) {
                throw new Error("You are not logged in!");
            }

            try {
                const userMe = await User.findById(user.id);
                return userMe;
            } catch (e) {
                throw new Error("Failed getting data");
            }
        },
    },
    Mutation: {
        async login(_, { username, password }): Promise<string> {
            let user: User.IUser;
            try {
                user = await User.findByUsername(username);
            } catch (e) {
                throw new Error("Failed getting data");
            }

            if (!user) {
                throw new Error("No user with that username");
            }

            if (!(await User.verifyPassword(user.password, password))) {
                throw new Error("Incorrect password");
            }

            return User.getJwt(user.id, user.session_hash);
        },
        async signup(_, { email, username, password }): Promise<string> {
            try {
                const user = await User.signup(email, username, password);
                return User.getJwt(user.id, user.session_hash);
            } catch (e) {
                throw new Error("Could not signup");
            }
        },
    },
};
