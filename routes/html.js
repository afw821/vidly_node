const path = require('path');
const auth = require('../middleware/auth');
module.exports = function(app) {
    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    app.get('/homepage', auth, function (req, res) {
    
        const token = res.token;
    
        var options = {
            headers: { 'x-auth-token' : token }
        }
        res.sendFile(path.join(__dirname, '../public/home.html'), options, function(err) {
            if(err) {
                console.log(err);
            }
        });
        //res.redirect('/login');
    });
};