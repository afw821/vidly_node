const mongoose = require("mongoose");

const securitySchema = new mongoose.Schema({
    question :{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    }
});

const Security = mongoose.model('Security', securitySchema);

module.exports = Security;