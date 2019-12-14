const Joi = require('joi');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
    movie: {
        type: [
            new mongoose.Schema({
                title: {
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 5,
                    maxlength: 255
                },
                dailyRentalRate: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 255
                }
            })
        ],
        required: true
    }
});

const Cart = mongoose.model('Cart', cartSchema);

function validateCart(items) {
    const schema ={
        userId: Joi.string().required(),
        movieId: Joi.required()
    }
    return Joi.validate(items, schema);
}

module.exports.Cart = Cart;
module.exports.validate = validateCart;