const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const ash = require('express-async-handler');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.get('/', [ auth, admin ], ash(async function (req, res) {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
}));

router.post('/', ash(async function (req, res) {
        const result = validate(req.body);
        if (result.error) return res.status(400).send(error.details[0].message);
       
        const user = await User.findById(req.body.userId);
        if (!user) return res.status(400).send('Invalid User');
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid movie.');

        if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');  
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
        movie.numberInStock--;
        movie.save();    
        res.send(rental);
}));

router.get('/:id', ash(async function (req, res) {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
    res.send(rental);
}));

module.exports = router;