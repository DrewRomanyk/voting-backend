import * as express from "express";

import UserService from "../services/user";
import { authorize } from "../middleware/auth";

const router = express.Router();

router.post("/signup", (req, res) => {
    UserService.signup(req.body)
    .then((user) => {
        return UserService.signToken({ id: user.id, sessionHash: user.sessionHash });
    })
    .then((token) => {
        res.status(200).send({
            status: "OK",
            result: token,
        });
    })
    .catch((error) => {
        if (error.ajv && error.validation) {
            res.status(400).send({
                status: "ERROR",
                message: "Validation went wrong",
                result: error,
            });
        }
        res.status(500).send({
            status: "ERROR",
            message: "Something went wrong",
            result: error,
        });
    });
});

router.post("/login", (req, res) => {
    UserService.getByUsernameOrEmail(req.body.usernameOrEmail)
    .then((user) => {
        return UserService.verifyPassword(user, req.body.password);
    })
    .then((user) => {
        return UserService.signToken({ id: user.id, sessionHash: user.sessionHash });
    })
    .then((token) => {
        res.status(200).send({
            status: "OK",
            result: token,
        });
    })
    .catch((error) => {
        if (error.ajv && error.validation) {
            res.status(400).send({
                status: "ERROR",
                message: "Validation went wrong",
                result: error,
            });
        }
        res.status(500).send({
            status: "ERROR",
            message: "Something went wrong",
            result: error,
        });
    });
});

router.get("/me", authorize, (req, res) => {
    const result = req.user.toJSON();
    result.password = undefined;
    result.sessionHash = undefined;
    res.status(200).send({
        status: "OK",
        result,
    });
});

export default router;
