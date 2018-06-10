module.exports = {
    server: {
        host: 'localhost',
        port: 3000
    },
    database: {
        host: 'localhost',
        port: 0,
        db: 'login',
        url: 'postgres'
    },
    key: {
        privateKey: 'blah',
        tokenExpiry: 1 * 30 * 1000 * 60 // 1 hour
    },
    email: {
        username: 'sendermailid',
        password: 'senderpassword',
        verifyEmailUrl: 'verifyEmail',
        resetEmailUrl: 'reset'
    }
};