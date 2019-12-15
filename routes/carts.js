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
    const userId = req.body.userId
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("invalid User");
    //IF//if !user.cartId this means this user is creating a new crt for the first time
    
    let cart = new Cart({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        movieId: [req.body.movieId]
    });

    cart = await cart.save();
    console.log('cart', cart);
    if(cart) res.send({ status: true, cart: cart });
    //get newly created cart id to assign it to the user
    const cartId = cart._id
    //lookup the user and by user Id and update null cart id to the cartId
    //***MAY NEED TO MOVE BELOW CODE TO RIGHT AFTER WE SAVE CART */
    const updatedUser = await User.findByIdAndUpdate(userId, {
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin,
        cartId: cartId
    }, { new: true });
    //ELSE//if user.cartId then we are updating the cart by the cartId stored on the user


}));

module.exports = router;