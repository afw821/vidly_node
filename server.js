const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


const customers = require('./routes/customers');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// require('./startup/routes')(app);
require('./routes/html')(app);
// require('./startup/db')();
require('./startup/config')();


app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/rentals', rentals);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/customers', customers);

const MONGODB_URI = ' mongodb://heroku_ts7csbwm:6rjkom7bics89mcfqtdbi3h1gj@ds353007.mlab.com:53007/heroku_ts7csbwm';

const TEST_URI = "mongodb://localhost/vidly_node";

// mongoose.connect(MONGODB_URI || TEST_URI, { useNewUrlParser: true }).then(function () {
//     console.log('Connected to MongoDB!!');
// })
//     .catch(function () {
//         console.log('Error connecting to MongoDB');
//     });

mongoose.connect(MONGODB_URI);

// if (process.env.MONGODB_URI) {
//     mongoose.connect(process.env.MONGODB_URI);
// } else {
//     //const db = config.get('db')
//     mongoose.connect("mongodb://localhost/vidly_node", { useNewUrlParser: true })
//         .then(function () {
//             console.log(`Connected to MongoDB!!!!!`)
//         }).catch(function (ex) {
//             console.log('Error connecting to MongoDB');
//         });
// }



const PORT = process.env.PORT || 8888;
const environment = `Environment: ${process.env.NODE_ENV}`;
console.log(environment);
const server = app.listen(PORT, function () {
    console.log(`App listening on PORT: ${PORT}`);
});

module.exports = server;