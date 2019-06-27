const path = require('path');
module.exports = function(app) {
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    // app.get('/alexsoutdoor', (req, res) => {
    //     res.sendFile(path.join(__dirname, '../public/home.html'));
    // });
};