const mongoose = require('mongoose');
const config = require('config');
module.exports = function () {
    const db = config.get('db')
    mongoose.connect(config.get('db'), { useNewUrlParser: true })
    .then(function () {
        console.log(`Connected to MongoDB: ${db}`)
    }).catch(function (ex) {
        console.log('Error connecting to MongoDB');
    })
}