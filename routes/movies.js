const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
//get all movies
router.get('/', auth, async function (req, res) {
    try {
        const movies = await Movie.find();
        res.send(movies);
    } catch (ex) {
        console.log('ex', ex);
    }

});
//post a new movie to DB
router.post('/', auth, async function (req, res) {
    //validate the req.body from the client
    const result = validate(req.body);
    //if error res to client 400 bad request
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    //find genre by genreId
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');
    //create a new movie object with the genre _id and name properties
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
//update route
router.put('/:id', auth, async function (req, res) {
    try {
        //validating the request body because we are sending a new movie object to update a current one

        const result = validate(req.body);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        //finding the genre by id
        const genre = await Genre.findById(req.body.genreId);
        //if genre doesn't exist return bad req to client
        if (!genre) return res.status(400).send('Invalid Genre');
        //define a new movie object to update after find by id
        const movie = await Movie.findByIdAndUpdate(req.params.id,
            {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }, { new: true });
        //if movie not found then return 404 to client
        if (!movie) return res.status(404).send('The movie with the given ID was not found.');
        //else send movie to the client 
        res.send(movie);
    } catch (ex) {
        console.log('FATAL ERROR:::', ex);
    }

});
//get movie by id
router.get('/:id', async function (req, res) {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) return res.status(404).send('The movie with thr requested id was not found!!');

        res.send(movie);
    } catch (ex) {
        res.send(ex);
        console.log('FATAL ERROR::', ex);
    }

});
//delete route
router.delete('/:id', async function (req, res) {
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        console.log(movie);
        if (!movie) return res.status(404).send('The movie with the given ID was not found.');
        console.log('Movie exists');
        res.send(movie);
    } catch (ex) {
        console.log('FATAL ERROR::', ex);
    }

});

module.exports = router;
