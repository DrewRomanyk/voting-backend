module.exports = {
    db: {
       uri: 'postgres://voterapp:voterapp1234@postgres/voterapp',
       practice_user_hash: 'HASH_GOES_HERE' // Goes to postgres/schema.sql#Initializing data/User/PASSWORD_HASH_HERE
    },
    jwt: {
        secret: 'jwt-secret'
    }
};
