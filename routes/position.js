const express = require("express");
const db = require("../db");

const router = express.Router();
const requiredProperties = [
    "current_position",
    "confidence",
    "source_url",
    "source_quote",
    "source_date",
    "submit_status"
];
const requiredCreateProperties = [
    "candidate_id",
    "issue_id",
    "submit_user_id",
    "submit_timezone"
].concat(requiredProperties);

// Create
router.post("/", (req, res) => {
    // TODO remove defaults
    req.body.submit_status = 0;
    req.body.submit_user_id = "42";
    req.body.submit_timezone = "America/New_York";
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
        "INSERT INTO voterapp.position (candidate_id, issue_id, current_position, confidence, source_quote, source_date, source_date, submit_status, submit_user_id, submit_timezone) VALUES (${candidate_id}, ${issue_id}, ${current_position}, ${confidence}, ${source_url}, ${source_quote}, ${source_date}, ${submit_status}, ${submit_user_id}, ${submit_timezone}) RETURNING *",
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
    db.any("SELECT * FROM voterapp.position")
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
router.get("/:candidate_id/:issue_id", (req, res) => {
    db.one(
        "SELECT * FROM voterapp.position WHERE candidate_id = ${candidate_id} AND issue_id = ${issue_id}",
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
router.patch("/:candidate_id/:issue_id", (req, res) => {
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
        "UPDATE voterapp.position SET current_position = ${current_position}, confidence = ${confidence}, source_url = ${source_url}, source_quote = ${source_quote}, source_date = ${source_date}, submit_status = ${submit_status} WHERE candidate_id = ${candidate_id} AND issue_id = ${issue_id} RETURNING *",
        {
            current_position: req.body.current_position,
            confidence: req.body.confidence,
            source_url: req.body.source_url,
            source_quote: req.body.source_quote,
            source_date: req.body.source_date,
            submit_status: req.body.submit_status,
            candidate_id: req.params.candidate_id,
            issue_id: req.params.issue_id
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
router.delete("/:candidate_id/:issue_id", (req, res) => {
    db.result(
        "DELETE FROM voterapp.position WHERE candidate_id = ${candidate_id} AND issue_id = ${issue_id}",
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
