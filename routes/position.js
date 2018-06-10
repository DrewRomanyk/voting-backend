const express = require('express');
const db = require('../db');

const router = express.Router();
const requiredProperties = ["current_position", "confidence"];
const requiredCreateProperties = ["candidate_id", "issue_id"].concat(requiredProperties);

// Create
router.post('/', (req, res) => {
    if (!requiredCreateProperties.every(prop => { return prop in req.body; })) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    db.one('INSERT INTO voterapp.position (candidate_id, issue_id, current_position, confidence) VALUES (${candidate_id}, ${issue_id}, ${current_position}, ${confidence}) RETURNING *', req.body)
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
    db.any('SELECT * FROM voterapp.position')
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
router.get('/:candidate_id/:issue_id', (req, res) => {
    db.one('SELECT * FROM voterapp.position WHERE candidate_id = ${candidate_id} AND issue_id = ${issue_id}', req.params)
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
router.patch('/:candidate_id/:issue_id', (req, res) => {
    if (!requiredProperties.every(prop => { return prop in req.body; })) {
        res.status(400).send({
            status: 'ERROR',
            result: 'required fields are empty!'
        });
        return;
    }

    db.one('UPDATE voterapp.position SET current_position = ${current_position}, confidence = ${confidence} WHERE candidate_id = ${candidate_id} AND issue_id = ${issue_id} RETURNING *', {
        current_position: req.body.current_position,
        confidence: req.body.confidence,
        candidate_id: req.params.candidate_id,
        issue_id: req.params.issue_id
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
router.delete('/:candidate_id/:issue_id', (req, res) => {
    db.result('DELETE FROM voterapp.position WHERE candidate_id = ${candidate_id} AND issue_id = ${issue_id}', req.params)
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