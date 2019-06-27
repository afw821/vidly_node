const express = require('express');
const path = require('path');
const customers = require('../routes/customers');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
//const html = require('../routes/html');
module.exports = function (app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/rentals', rentals);
    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
    app.use('/api/customers', customers);
}