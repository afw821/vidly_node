const mongoose = require('mongoose');
const Joi = require('joi');

//define your GENRE Schema
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

//Joi validation function to export and validate USER REQ OBJECT
function validateGenre(genre) {
    //define a schema to validate
    const schema = {
        name: Joi.string().min(3).max(50).required()
    };
    return Joi.validate(genre, schema);
}
//export and use obj destructuring to require
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validateGenre;