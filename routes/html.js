const path = require('path');
const auth = require('../middleware/auth');
module.exports = function(app) {
    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    app.get('/homepage', auth, function (req, res) {
        res.sendFile(path.join(__dirname, '../public/home.html'));
        //res.redirect('/login');
    });
};