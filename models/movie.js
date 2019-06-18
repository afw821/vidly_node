//joi schema is what the client sends us
//that's the input to out api
const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
//define a new movie schema

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    }
})