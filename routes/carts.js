const { Cart, validate } = require('../models/cart');
const { Movie } = require('../models/movie');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const ash = require('express-async-handler');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.post('/', ash(function(req,res) {
    //validate the req body validate function
    const result = validate(req.body);
    if (result.error) return res.status(400).send(error.details[0].message);

    
}));