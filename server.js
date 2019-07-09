const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
require('./startup/routes')(app);
require('./routes/html')(app);
require('./startup/db')();
require('./startup/config')();

const PORT = process.env.PORT || 8888;
const environment = `Environment: ${process.env.NODE_ENV}`;
console.log(environment);
const server = app.listen(PORT, function () {
    console.log(`App listening on PORT: ${PORT}`);
});

module.exports = server;