const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');

const port = process.env.PORT || 8888;
const server = app.listen(port, function () {
    console.log(`App listening on PORT: ${port}`);
});

module.exports = server;