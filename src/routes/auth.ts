import * as argon2 from "argon2";
import * as express from "express";
import * as jwt from "jsonwebtoken";

import config from "../config";
import db from "../db";

const router = express.Router();

router.post("/", (req, res) => {
    db.one("SELECT * FROM voterapp.user WHERE username = $<username>", {
        username: req.body.username,
    })
        .then((data) => {
            argon2
                .verify(data.password, req.body.password)
                .then((match) => {
                    if (match) {
                        const payload = {
                            id: data.id,
                            session_hash: data.session_hash,
                        };
                        const token = jwt.sign(payload, config.jwt.secret, {
                            expiresIn: "24h",
                        });
                        res.cookie("auth-token", token);
                        res.status(200).send({
                            status: "OK",
                            result: token,
                        });
                    } else {
                        res.status(400).send({
                            status: "ERROR",
                            message: "Wrong password",
                            result: null,
                        });
                    }
                })
                .catch((error => {
                    res.status(400).send({
                        status: "ERROR",
                        message: "Verify password error",
                        result: error,
                    });
                }));
        })
        .catch((error) => {
            res.status(400).send({
                status: "ERROR",
                message: "DB error",
                result: error,
            });
        });
});

function authorize(req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.cookies["auth-token"];

    if (!token) {
        res.status(400).send({
            status: "ERROR",
            result: "No token given",
        });
        return;
    }

    jwt.verify(token, config.jwt.secret, (error, jwtData) => {
        if (error) {
            res.status(400).send({
                status: "ERROR",
                message: "Invalid token",
                result: error,
            });
        } else {
            db.one(
                "SELECT session_hash FROM voterapp.user WHERE id = $<id>",
                jwtData,
            )
                .then((data) => {
                    if (data.session_hash === jwtData.session_hash) {
                        req.decoded = jwtData;
                        next();
                    } else {
                        res.status(400).send({
                            status: "ERROR",
                            message: "Invalid token session",
                            result: error,
                        });
                    }
                })
                .catch((dbError) => {
                    res.status(400).send({
                        status: "ERROR",
                        message: "DB error",
                        result: dbError,
                    });
                });
        }
    });
}

export default {
    router,
    authorize,
};
