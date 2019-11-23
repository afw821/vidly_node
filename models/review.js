const Joi = require('joi');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            email: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            }
        }),
        required: true
    },
    comment: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 500
    },
    subject: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    stars: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

function validateReview(review) {
    const schema = {
        userId: Joi.string().required(),
        comment: Joi.string().required().min(15).max(500),
        subject: Joi.string().required().min(5).max(50),
        stars: Joi.number().required()
    };
    return Joi.validate(review, schema);
}
module.exports.Review = Review;
module.exports.validate = validateReview;