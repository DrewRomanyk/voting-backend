import * as Candidate from "./models/candidate/gqlSchema";
import * as User from "./models/user/gqlSchema";

export default [ Candidate.resolver, User.resolver ];
