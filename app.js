const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db');
const category_router = require('./routes/category');

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200).send({
    status: 'Welcome to the Voting Backend!'
}));

// Test DB
db.one('SELECT $1 AS value', 1234)
    .then(function (data) {
        console.log('Database connection success:', data);
    })
    .catch(function (error) {
        console.log('Database connection failed:', error);
    });

app.use('/api/category', category_router);

app.listen(port, error => {
    if (error) {
        console.error(error);
    } else {
        console.log('Server started on port ' + port);
    }
});
