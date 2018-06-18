const express = require("express");
const db = require("../db");

const router = express.Router();
const requiredProperties = ["name", "score"];
const requiredCreateProperties = ["candidate_id", "topic_id"].concat(
    requiredProperties
);

// Create
router.post("/", (req, res) => {
    if (
        !requiredCreateProperties.every(prop => {
            return prop in req.body;
        })
    ) {
        res.status(400).send({
            status: "ERROR",
            result: "required fields are empty!"
        });
        return;
    }

    db.one(
        'INSERT INTO voterapp.topic_summary (candidate_id, topic_id, "name", score) VALUES (${candidate_id}, ${topic_id}, ${name}, ${score}) RETURNING *',
        req.body
    )
        .then(data => {
            res.status(200).send({
                status: "OK",
                result: data
            });
        })
        .catch(error => {
            res.status(400).send({
                status: "ERROR",
                result: error
            });
        });
});

// View all
router.get("/", (req, res) => {
    db.any("SELECT * FROM voterapp.topic_summary")
        .then(data => {
            res.status(200).send({
                status: "OK",
                result: data
            });
        })
        .catch(error => {
            res.status(400).send({
                status: "ERROR",
                result: error
            });
        });
});

// View
router.get("/:candidate_id/:topic_id", (req, res) => {
    db.one(
        "SELECT * FROM voterapp.topic_summary WHERE candidate_id = ${candidate_id} AND topic_id = ${topic_id}",
        req.params
    )
        .then(data => {
            res.status(200).send({
                status: "OK",
                result: data
            });
        })
        .catch(error => {
            res.status(400).send({
                status: "ERROR",
                result: error
            });
        });
});

// Update
router.patch("/:candidate_id/:topic_id", (req, res) => {
    if (
        !requiredProperties.every(prop => {
            return prop in req.body;
        })
    ) {
        res.status(400).send({
            status: "ERROR",
            result: "required fields are empty!"
        });
        return;
    }

    db.one(
        'UPDATE voterapp.topic_summary SET "name" = ${name}, score = ${score} WHERE candidate_id = ${candidate_id} AND topic_id = ${topic_id} RETURNING *',
        {
            name: req.body.name,
            score: req.body.score,
            candidate_id: req.params.candidate_id,
            topic_id: req.params.topic_id
        }
    )
        .then(data => {
            res.status(200).send({
                status: "OK",
                result: data
            });
        })
        .catch(error => {
            res.status(400).send({
                status: "ERROR",
                result: error
            });
        });
});

// Delete
router.delete("/:candidate_id/:topic_id", (req, res) => {
    db.result(
        "DELETE FROM voterapp.topic_summary WHERE candidate_id = ${candidate_id} AND topic_id = ${topic_id}",
        req.params
    )
        .then(data => {
            res.status(200).send({
                status: "OK",
                result: data
            });
        })
        .catch(error => {
            res.status(400).send({
                status: "ERROR",
                result: error
            });
        });
});

module.exports = router;
