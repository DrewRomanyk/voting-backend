const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const db = require("./db");
const auth = require("./routes/auth");
const categoryRouter = require("./routes/category");
const topicRouter = require("./routes/topic");
const issueRouter = require("./routes/issue");
const candidateRouter = require("./routes/candidate");
const topicSummaryRouter = require("./routes/topicSummary");
const positionRouter = require("./routes/position");
const partyRouter = require("./routes/party");
const userRouter = require("./routes/user");

// Setup app
const app = express();
const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Ensure DB is connected
db.one("SELECT $1 AS value", 1234)
    .then(data => {
        console.log("Database connection success:", data);
    })
    .catch(error => {
        console.log("Database connection failed:", error);
    });

// Routes
const BASE_URL = "/api";
app.get(BASE_URL, (req, res) =>
    res.status(200).send({
        status: "Welcome to the Voting Backend!"
    })
);
app.use(`${BASE_URL}/auth`, auth.router);
app.use(`${BASE_URL}/category`, categoryRouter);
app.use(`${BASE_URL}/topic`, topicRouter);
app.use(`${BASE_URL}/issue`, issueRouter);
app.use(`${BASE_URL}/candidate`, candidateRouter);
app.use(`${BASE_URL}/topic_summary`, topicSummaryRouter);
app.use(`${BASE_URL}/position`, positionRouter);
app.use(`${BASE_URL}/party`, partyRouter);
app.use(`${BASE_URL}/user`, auth.authorize, userRouter);

// Start app
app.listen(port, error => {
    if (error) {
        console.error(error);
    } else {
        console.log(`Server started on port ${port}`);
    }
});
