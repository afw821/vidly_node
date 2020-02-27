const express = require('express');
const path = require('path');

const customers = require("../routes/customers");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const addMovies = require("../routes/viewRoutes/addMovies"); //admin pg
const deleteMovie = require("../routes/viewRoutes/getDeleteMovie"); //admin pg
const reviews = require('../routes/reviews');
const carts = require('../routes/carts');
const getUsers = require('../routes/viewRoutes/getUsers'); //get user view for admin pg
const getCreateAdmin = require('../routes/viewRoutes/getCreateAdmin'); //get user view for admin pg
const nodemailer = require('../routes/NodeMailer/nodemailer');
//const html = require('../routes/html');
module.exports = function (app) { 
    app.use("/api/auth", auth);
    app.use("/api/users", users);
    app.use("/api/rentals", rentals);
    app.use("/api/genres", genres);
    app.use("/api/movies", movies);
    app.use("/api/customers", customers);
    app.use("/api/addMovie", addMovies);
    app.use("/api/getDeleteMovie", deleteMovie);
    app.use('/api/reviews', reviews);
    app.use('/api/carts', carts);
    app.use('/api/getUsers', getUsers);
    app.use('/api/getCreateAdmin', getCreateAdmin);
    app.use('/api/nodemailer', nodemailer);
}