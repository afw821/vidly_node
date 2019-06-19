const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const express = require('express');
const router = express.Router();

//get all rentals
router.get('/', async function (req, res) {
    //get all rentals and sort by the date out
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});
//post a rental AKA checkout or BUYING PRODUCTS
router.post('/', async function(req,res) {
    //validate the request client sends
    const result = validate(req.body);
    //if error return 400 bad request to the client
    if (result.error) return res.status(400).send(error.details[0].message);
    //find customer by id
    const customer = await Customer.findById(req.body.customerId);
    //if customer doesn't exist then return 400 to client
    if (!customer) return res.status(400).send('Invalid customer.');
    //same logic as ablove but for MOVIE
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');
    //check to see if movie is in stock if not return not in stock to the client
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');
});