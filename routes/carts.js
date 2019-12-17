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
    console.log('req body movieId', req.body.movieId);
    
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
            movieId: movieId.map(id => id)
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
        //ELSE//if user.cartId then we are updating the cart by the cartId stored on the user
        //find cart by id and update
        //need to find it first to get all current calues in 
        let cart = await Cart.findById(user.cartId);
        console.log('movie ids in original cart', typeof cart.movieId);
        console.log(cart.movieId[1]);
        // const combinedCartItems = cart.movieId.map(id => id);
        // console.log('combined cart items', combinedCartItems);
        //console.log('user.cart id true so user has a cart already', user.cartId);
        // let updatedCart = await Cart.findByIdAndUpdate(user.cartId, {
        //     user: {
        //         _id: user._id,
        //         name: user.name,
        //         email: user.email
        //     },
        //     movieId: movieId
        // }, { new: true });

        // res.send({ status: true, updatedCart: updatedCart, user: user });
    }

    


}));

module.exports = router;