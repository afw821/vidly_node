const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

//get all rentals
router.get('/', async function (req, res) {
    //get all rentals and sort by the date out
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});
//post a rental AKA checkout or BUYING PRODUCTS
router.post('/', async function (req, res) {
    try{
        console.log('req body', req.body.userId);
        //validate the request client sends
        const result = validate(req.body);
        //if error return 400 bad request to the client
        if (result.error) return res.status(400).send(error.details[0].message);
        //find customer by id
        const user = await User.findById(req.body.userId);
        console.log('user', user);
        //if customer doesn't exist then return 400 to client
        if (!user) return res.status(400).send('Invalid User');
        //same logic as ablove but for MOVIE
        const movie = await Movie.findById(req.body.movieId);
        console.log('movie', movie);
        if (!movie) return res.status(400).send('Invalid movie.');
        //check to see if movie is in stock if not return not in stock to the client
        if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');
        //create a new rental object
    
        let rental = new Rental({
            user: {
                //keys here are NEW
                //Values are from the retrieved user object
                _id: user._id,
                name: user.name,
                email: user.email
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        rental = await rental.save();
        //decrease the  number of movies in stock by 1
        movie.numberInStock--;
        movie.save();
    
        res.send(rental);
    }catch (ex) {
        console.log(`fatal error for POSTing rental: ${ex}`);
    }

});
//get a rental by the id
router.get('/:id', async function (req, res) {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

module.exports = router;