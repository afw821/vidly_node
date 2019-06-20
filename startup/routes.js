const express = require('express');
const path = require('path');
const customers = require('../routes/customers');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
module.exports = function (app) {
    app.use('/api/rentals', rentals);
    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
    app.use('/api/customers', customers);
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
}