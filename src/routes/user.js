const express = require("express");
const argon2 = require("argon2");
const crypto = require("crypto");

const db = require("../db");

const router = express.Router();
const requiredProperties = ["email", "username", "password"];
const PASSWORD_MAX_LENGTH = 160;
const SESSION_HASH_LENGTH = 20;

// Create
router.post("/", (req, res) => {
    if (
        !requiredProperties.every(prop => prop in req.body) ||
        req.body.password.length > PASSWORD_MAX_LENGTH
    ) {
        res.status(400).send({
            status: "ERROR",
            result: "required fields are empty!"
        });
        return;
    }

    req.body.session_hash = crypto
        .randomBytes(SESSION_HASH_LENGTH)
        .toString("hex");

    db.one(
        'INSERT INTO voterapp.user (email, username, "password", session_hash) VALUES ($<email>, $<username>, $<password>, $<session_hash>) RETURNING id, email, username, role_id',
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
    db.any("SELECT id, email, username, role_id FROM voterapp.user")
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
router.get("/:id", (req, res) => {
    db.one(
        "SELECT id, email, username, role_id FROM voterapp.user WHERE id = $<id>",
        {
            id: req.params.id
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

// Update
router.patch("/:id", (req, res) => {
    if (
        !requiredProperties.every(prop => prop in req.body) ||
        req.body.password.length > PASSWORD_MAX_LENGTH
    ) {
        res.status(400).send({
            status: "ERROR",
            result: "required fields are empty!"
        });
        return;
    }

    const sessionHash = crypto.randomBytes(SESSION_HASH_LENGTH).toString("hex");

    argon2
        .hash(req.body.password)
        .then(hash => {
            db.one(
                'UPDATE voterapp.user SET email = $<email>, username = $<username>, "password" = $<password>, session_hash = $<session_hash> WHERE id = $<id> RETURNING id, email, username, role_id',
                {
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    session_hash: sessionHash,
                    id: req.params.id
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
        })
        .catch(error => {
            res.status(400).send({
                status: "ERROR",
                result: error
            });
        });
});

// Delete
router.delete("/:id", (req, res) => {
    db.result("DELETE FROM voterapp.user WHERE id = $<id>", {
        id: req.params.id
    })
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
