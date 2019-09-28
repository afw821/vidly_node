const { User, validate } = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
//authorization--user has permission to access resource or not
const auth = require('../middleware/auth');
const path = require('path');

//get information about the current user
router.get('/me', auth, async function (req, res) {
    try {
        //more secure than passing id as a parameter
        //exclude password property
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    } catch (ex) {
        console.log('error', ex);
    }

});
//register a new user
router.post('/', async function (req, res) {
    //validate the user input
    // const result = validate(req.body);
    // if (result.error) {

    //     res.status(404).send(result.error.details[0].message);
    //     return;
    // }
    // //lookup user by email and if the exist return 400
    // let user = await User.findOne({ email: req.body.email });
    // //if user already exists in the database by email then return
    // if (user) return res.status(400).send('User already registered');
    //else create the new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });
    //salt and has passord using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //savit the new user
    await user.save();

    //generate jwt with function in user.js
    const token = user.generateAuthToken();
    //after generating the token set it to the response header
    //exclude the password from being sent
    //res.header('x-auth-token', token);
    res.send(user);
});

router.get('/', async function (req, res) {
    try {
        const users = await User.find();
        res.send(users);
    } catch (ex) {
        console.log('ex:', ex);
    }

});

module.exports = router;