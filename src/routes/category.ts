import * as express from "express";

import { authorize } from "../middleware/auth";

const router = express.Router();

router.get("/", authorize, (_, res) => {
    res.status(200).send({
        status: "OK",
        result: "Under construction...",
    });
});

export default router;
