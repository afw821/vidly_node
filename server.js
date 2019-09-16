const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('./startup/routes')(app);
require('./routes/html')(app);
// require('./startup/db')();
require('./startup/config')();
console.log('mongo db ui', process.env);


if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    //const db = config.get('db')
    mongoose.connect("mongodb://localhost/vidly_node", { useNewUrlParser: true })
        .then(function () {
            console.log(`Connected to MongoDB!!!!!`)
        }).catch(function (ex) {
            console.log('Error connecting to MongoDB');
        });
}



const PORT = process.env.PORT || 8888;
const environment = `Environment: ${process.env.NODE_ENV}`;
console.log(environment);
const server = app.listen(PORT, function () {
    console.log(`App listening on PORT: ${PORT}`);
});

module.exports = server;