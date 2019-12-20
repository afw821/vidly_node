const { Cart, validate } = require('../models/cart');
const { Movie } = require('../models/movie');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const ash = require('express-async-handler');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.post('/', ash(async function (req, res) {
    //validate the req body validate function
    const result = validate(req.body);
    if (result.error) return res.status(400).send(error.details[0].message);
    //find user  
    const userId = req.body.userId;
    const movieId = req.body.movieId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("invalid User");
    //IF//if !user.cartId this means this user is creating a new crt for the first time
    if (!user.cartId) {
        let cart = new Cart({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            movieId: movieId //use movieId.map(id => id) to send more than one movie id at a time
        });

        cart = await cart.save();

        //lookup the user and by user Id and update null cart id to the cartId
        //get newly created cart id to assign it to the user
        const cartId = cart._id
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            cartId: cartId
        }, { new: true });

        res.send({ status: true, cart: cart, updatedUser: updatedUser });

    } else { //else user has a cart already 
        const cartArray = [];

        let cart = await Cart.findById(user.cartId);

        cart.movieId.forEach(function(id){
            cartArray.push(id);
        });
        cartArray.push(movieId);

        let updatedCart = await Cart.findByIdAndUpdate(user.cartId, {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            movieId: cartArray
        }, { new: true });

        res.send({ status: true, updatedCart: updatedCart, user: user });
    }
}));

router.get('/:id', ash(async function(req,res){
    const moviesArray = [];
    const cart = await Cart.findById(req.params.id);

    if(!cart) return res.status(404).send("The cart with the given id was not found");

    for(let i = 0; i < cart.movieId.length; i++) {
        var movies = await Movie.findById(cart.movieId[i]);
        moviesArray.push(movies);
    }   
    res.send(moviesArray);
}));

module.exports = router;