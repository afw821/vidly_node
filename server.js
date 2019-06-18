const express = require('express');
const app = express();



const port = process.env.PORT || 8888;
const server = app.listen(port, function () {
    console.log(`App listening on PORT: ${port}`);
})