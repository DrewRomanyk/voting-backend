const express = require('express');
const db = require('../db');

const router = express.Router();
const requiredProperties = ["email", "username", "password"];

// Create
router.post('/', (req, res) => {
    if (!requiredProperties.every(prop => { return prop in req.body; })) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    db.one('INSERT INTO voterapp.user (email, username, "password") VALUES (${email}, ${username}, ${password}) RETURNING *', req.body)
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

// View all
router.get('/', (req, res) => {
    db.any('SELECT * FROM voterapp.user')
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

// View
router.get('/:id', (req, res) => {
    db.one('SELECT * FROM voterapp.user WHERE id = ${id}', {
        id: req.params.id
    })
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

// Update
router.patch('/:id', (req, res) => {
    if (!requiredProperties.every(prop => { return prop in req.body; })) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    db.one('UPDATE voterapp.user SET email = ${email}, username = ${username}, "password" = ${password} WHERE id = ${id} RETURNING *', {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        id: req.params.id
    })
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

// Delete
router.delete('/:id', (req, res) => {
    db.result('DELETE FROM voterapp.user WHERE id = ${id}', {
        id: req.params.id
    })
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