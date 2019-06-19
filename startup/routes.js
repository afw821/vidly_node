const express = require('express');
const path = require('path');
const customers = require('../routes/customers');
module.exports = function (app) {
    app.use('/api/customers', customers);
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
}