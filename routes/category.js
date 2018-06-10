const express = require('express');
const db = require('../db');

const router = express.Router();

// Create
router.post('/', (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            status: 'ERROR',
            result: 'name field is empty!'
        });
        return;
    }

    db.one('INSERT INTO voterapp.category ("name") VALUES (${name}) RETURNING *', {
        name: req.body.name
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

// View all
router.get('/', (req, res) => {
    db.many('SELECT * FROM voterapp.category')
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
router.post('/:id', (req, res) => {
    db.one('SELECT * FROM voterapp.category WHERE id = ${id}', {
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
    if (!req.body.name) {
        res.status(400).send({
            status: 'ERROR',
            result: 'name field is empty!'
        });
        return;
    }

    db.one('UPDATE voterapp.category SET "name" = ${name} WHERE id = ${id} RETURNING *', {
        name: req.body.name, 
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
    db.result('DELETE FROM voterapp.category WHERE id = ${id}', {
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
