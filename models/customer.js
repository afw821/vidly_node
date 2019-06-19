const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
});

function validateCustomer(customer) {
    //define a schema to validate ( we are validating the name)
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };
    //return validated schema vaidate it against genre
    return Joi.validate(customer, schema);
}

const Customer = mongoose.model('Customer', customerSchema);

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;