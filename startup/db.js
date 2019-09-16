const mongoose = require('mongoose');
const config = require('config');
module.exports = function () {

    // if (process.env.MONGODB_URI) {
    //     mongoose.connect(process.env.MONGODB_URI);
    // } else {
    //const db = config.get('db')
    //mongoose.connect("mongodb://localhost/vidly_node", { useNewUrlParser: true })
    mongoose.connect("mongodb://heroku_ts7csbwm:6rjkom7bics89mcfqtdbi3h1gj@ds353007.mlab.com:53007/heroku_ts7csbwm", { useNewUrlParser: true })
        .then(function () {
            console.log(`Connected to MongoDB!!!!!`)
        }).catch(function (ex) {
            console.log('Error connecting to MongoDB');
        });
    //}

}