// tslint:disable max-line-length
export default {
    db: {
        uri: "postgres://voterapp:voterapp1234@postgres/voterapp",
        practice_user_email: "practice@email.com",
        practice_username: "practice",
        practice_user_hash: "HASH_GOES_HERE", // Goes to postgres/schema.sql#Initializing data/User/PASSWORD_HASH_HERE
    },
    jwt: {
        secret: "jwt-secret",
        session_hash_length: 20,
        expiration: "24h",
    },
};
