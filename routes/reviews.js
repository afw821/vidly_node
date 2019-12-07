const { Review, validate } = require('../models/review');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const ash = require('express-async-handler');

router.post('/', ash(async function (req, res) {
    const result = validate(req.body);
    console.log('result', result);
    // if(result.error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if(!user) return res.status(400).send('Invalid User');

    let review = new Review({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        comment: req.body.comment,
        subject: req.body.subject,
        stars: req.body.stars
    });

    review = await review.save();
    
    res.send({ status: true, review: review });
}));

router.get('/', ash(async function (req, res) {

    const reviews = await Review.find();
    if(!reviews) return res.status(404).send('Review was not found');

    res.send(reviews);
}));

module.exports = router;