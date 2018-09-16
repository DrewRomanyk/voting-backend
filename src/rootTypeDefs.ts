import { gql } from "apollo-server-express";

import * as Candidate from "./models/candidate/gqlSchema";
import * as User from "./models/user/gqlSchema";

const root = gql`
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }
`;

export default [ root, Candidate.typeDefs, User.typeDefs ];
