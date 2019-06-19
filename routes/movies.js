const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();

//get all movies
router.get('/', async function (req, res) {
    const movies = await Movie.find();
    res.send(movies);
});
//post a new movie to DB
router.post('/', async function (req, res) {
    //validate the req.body from the client
    const result = validate(req.body);
    //if error res to client 400 bad request
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    //find genre by genreId
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
  
    res.send(movie);
});