const express = require('express');
const db = require('../db');

const router = express.Router();

// Create
router.post('/', (req, res) => {
    if (!req.body.name || !req.body.category_id) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    db.one('INSERT INTO voterapp.topic ("name", category_id) VALUES (${name}, ${category_id}) RETURNING *', req.body)
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
    if (!req.body.name || !req.body.category_id) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    db.one('UPDATE voterapp.topic SET "name" = ${name}, category_id = ${category_id} WHERE id = ${id} RETURNING *', {
        name: req.body.name,
        category_id: req.body.category_id,
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
