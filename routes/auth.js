const Joi = require('joi');
const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
//POSTING A LOGIN------VALIDATING AN EXISTING USER AND LOGGING HIM IN
router.post('/', async function (req, res) {
    //validate the user input
    const result = validateUser(req.body);
    console.log('Result::', result);
    //if invalid return a 404 error to the client
    if (result.error) {
        res.status(404).send(result.error.details[0].message);
        return;
    }
    //look up user by email to see if they already exist
    let user = await User.findOne({ email: req.body.email });
    console.log('User::', user);
    //used to validate username and email (dont't want to tell the client why the auth failed)
    if (!user) return res.status(400).send('invalid email or password');
    //validate password, plain text PW, Hashed PW, Returns a boolean
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    console.log('ValidPassword::', validPassword);
    //if password is invalid send bad request back to the client
    if (!validPassword) return res.status(400).send('invalid email or password');
    //generate auth token from schema method in user.js
    const token = user.generateAuthToken();//token generated in user.js

    res.send(token);
});

//define a validate user function to validate the user input
function validateUser(user) {
    //define a schema to validate ( we are validating the name)
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    //return validated schema vaidate it against genre
    return Joi.validate(user, schema);
}
module.exports = router;