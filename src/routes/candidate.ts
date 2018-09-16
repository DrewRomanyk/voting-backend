import * as express from "express";

import db from "../db";

const router = express.Router();
const requiredProperties = [
    "name",
    "party_id",
    "date_of_birth",
    "submit_status",
];
const requiredCreateProperties = ["submit_user_id", "submit_timezone"].concat(
    requiredProperties,
);

// Create
router.post("/", (req, res) => {
    // TODO remove defaults
    req.body.submit_status = 0;
    req.body.submit_user_id = "42";
    req.body.submit_timezone = "America/New_York";
    if (!requiredCreateProperties.every((prop) => prop in req.body)) {
        res.status(400).send({
            status: "ERROR",
            result: "required fields are empty!",
        });
        return;
    }

    // req.body.website_url = req.body.website_url || null;

    db.one(
        "INSERT INTO voterapp.candidate " +
            "(\"name\", party_id, date_of_birth, website_url, submit_status, submit_user_id, submit_timezone) " +
            "VALUES ($<name>, $<party_id>, $<date_of_birth>, $<website_url>, $<submit_status>, $<submit_user_id>, " +
            "$<submit_timezone>) RETURNING *",
        req.body,
    )
        .then((data) => {
            res.status(200).send({
                status: "OK",
                result: data,
            });
        })
        .catch((error) => {
            res.status(400).send({
                status: "ERROR",
                result: error,
            });
        });
});

// View all
router.get("/", (_, res) => {
    db.any("SELECT * FROM voterapp.candidate")
        .then((data) => {
            res.status(200).send({
                status: "OK",
                result: data,
            });
        })
        .catch((error) => {
            res.status(400).send({
                status: "ERROR",
                result: error,
            });
        });
});

// View
router.get("/:id", (req, res) => {
    db.one("SELECT * FROM voterapp.candidate WHERE id = $<id>", {
        id: req.params.id,
    })
        .then((data) => {
            res.status(200).send({
                status: "OK",
                result: data,
            });
        })
        .catch((error) => {
            res.status(400).send({
                status: "ERROR",
                result: error,
            });
        });
});

// Update
router.patch("/:id", (req, res) => {
    if (!requiredProperties.every((prop) => prop in req.body)) {
        res.status(400).send({
            status: "ERROR",
            result: "required fields are empty!",
        });
        return;
    }

    db.one(
        "UPDATE voterapp.candidate SET \"name\" = $<name>, party_id = $<party_id>, date_of_birth = $<date_of_birth>, " +
            "website_url = $<website_url>, submit_status = $<submit_status> WHERE id = $<id> RETURNING *",
        {
            name: req.body.name,
            party_id: req.body.party_id,
            date_of_birth: req.body.date_of_birth,
            website_url: req.body.website_url,
            submit_status: req.body.submit_status,
            id: req.params.id,
        },
    )
        .then((data) => {
            res.status(200).send({
                status: "OK",
                result: data,
            });
        })
        .catch((error) => {
            res.status(400).send({
                status: "ERROR",
                result: error,
            });
        });
});

// Delete
router.delete("/:id", (req, res) => {
    db.result("DELETE FROM voterapp.candidate WHERE id = $<id>", {
        id: req.params.id,
    })
        .then((data) => {
            res.status(200).send({
                status: "OK",
                result: data,
            });
        })
        .catch((error) => {
            res.status(400).send({
                status: "ERROR",
                result: error,
            });
        });
});

export default router;