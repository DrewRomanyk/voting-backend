const express = require('express');
const db = require('../db');

const router = express.Router();
const requiredProperties = ["name", "party_id", "date_of_birth"];

// Create
router.post('/', (req, res) => {
    if (!requiredProperties.every(prop => { return prop in req.body; })) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    // req.body.website_url = req.body.website_url || null;

    db.one('INSERT INTO voterapp.candidate ("name", party_id, date_of_birth, website_url) VALUES (${name}, ${party_id}, ${date_of_birth}, ${website_url}) RETURNING *', req.body)
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
    db.any('SELECT * FROM voterapp.candidate')
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
    db.one('SELECT * FROM voterapp.candidate WHERE id = ${id}', {
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

    db.one('UPDATE voterapp.candidate SET "name" = ${name}, party_id = ${party_id}, date_of_birth = ${date_of_birth}, website_url = ${website_url} WHERE id = ${id} RETURNING *', {
        name: req.body.name,
        party_id: req.body.party_id,
        date_of_birth: req.body.date_of_birth,
        website_url: req.body.website_url,
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
    db.result('DELETE FROM voterapp.issue WHERE id = ${id}', {
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
