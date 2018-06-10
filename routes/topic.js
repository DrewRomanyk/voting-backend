const express = require('express');
const db = require('../db');

const router = express.Router();
const requiredProperties = ["name", "category_id", "submit_status"];
const requiredCreateProperties = ["submit_user_id", "submit_timezone"].concat(requiredProperties);

// Create
router.post('/', (req, res) => {
    // TODO remove defaults
    req.body.submit_status = 0;
    req.body.submit_user_id = '42';
    req.body.submit_timezone = 'America/New_York';
    if (!requiredCreateProperties.every(prop => { return prop in req.body; })) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    db.one('INSERT INTO voterapp.topic ("name", category_id, submit_status, submit_user_id, submit_timezone) VALUES (${name}, ${category_id}, ${submit_status}, ${submit_user_id}, ${submit_timezone}) RETURNING *', req.body)
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
    db.any('SELECT * FROM voterapp.topic')
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
    db.one('SELECT * FROM voterapp.topic WHERE id = ${id}', {
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

    db.one('UPDATE voterapp.topic SET "name" = ${name}, category_id = ${category_id}, submit_status = ${submit_status} WHERE id = ${id} RETURNING *', {
        name: req.body.name,
        category_id: req.body.category_id,
        submit_status: req.body.submit_status,
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
    db.result('DELETE FROM voterapp.topic WHERE id = ${id}', {
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
