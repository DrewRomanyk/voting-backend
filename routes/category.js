const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
    db.many('SELECT * FROM voterapp.category', [req.params.id])
    .then(function (data) {
        res.status(200).send({
            status: 'OK',
            result: data
        });
    })
    .catch(function (error) {
        res.status(400).send({
            status: 'ERROR',
            result: error
        });
    });
});

router.get('/:id', (req, res) => {
    db.one('SELECT * FROM voterapp.category WHERE id = $1', [req.params.id])
    .then(function (data) {
        res.status(200).send({
            status: 'OK',
            result: data
        });
    })
    .catch(function (error) {
        res.status(400).send({
            status: 'ERROR',
            result: error
        });
    });
});

module.exports = router;
