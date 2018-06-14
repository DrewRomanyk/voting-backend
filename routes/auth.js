const express = require('express');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const db = require('../db');
const config = require('../config')

const router = express.Router();

router.post('/', (req, res) => {
    db.one('SELECT * FROM voterapp.user WHERE username = ${username}', {
        username: req.body.username
    })
    .then(data => {
        argon2.verify(data.password, req.body.password).then(match => {
            if (match) {
                const payload = {
                    id: data.id,
                    session_hash: data.session_hash
                };
                const token = jwt.sign(payload, config.jwt.secret, {
                    expiresIn: "24h"
                });
                res.status(200).send({
                    status: 'OK',
                    result: token
                });
            } else {
                res.status(400).send({
                    status: 'ERROR',
                    message: 'Wrong password',
                    result: error
                });
            }
          }).catch(error => {
            res.status(400).send({
                status: 'ERROR',
                message: 'Verify password error',
                result: error
            });
          });
    })
    .catch(error => {
        res.status(400).send({
            status: 'ERROR',
            message: 'DB error',
            result: error
        });
    });
});


function autherize(req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.jwt.secret, (error, decoded) => {      
            if (error) {
                res.status(400).send({
                    status: 'ERROR',
                    message: 'Invalid token',
                    result: error
                });
            } else {
                db.one('SELECT session_hash FROM voterapp.user WHERE id = ${id}', decoded)
                .then(data => {
                    if (data.session_hash == decoded.session_hash) {
                        req.decoded = decoded;
                        next();
                    } else {
                        res.status(400).send({
                            status: 'ERROR',
                            message: 'Invalid token session',
                            result: error
                        });
                    }
                })
                .catch(error => {
                    res.status(400).send({
                        status: 'ERROR',
                        message: 'DB error',
                        result: error
                    });
                });
            }
        });
    } else {
        res.status(400).send({
            status: 'ERROR',
            result: 'No Token bruh'
        });
    }
}

module.exports = {
    router: router,
    autherize: autherize
};
