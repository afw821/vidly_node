const jwt = require('jsonwebtoken');
const config = require('config');
//this middleware function protects certain routes
//In this case post genre route
function auth(req, res, next) {

    //set token to the request header
    const token = req.header('x-auth-token');
    console.log('auth token', token);
    //if the JWT doesn't exist send unauthorized
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        // //id there is a token we need to verify it's a valid token
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        // //ABOVE WILL BE DECODED PAYLOAD
        //Decoded user object from Sign method
        req.user = decoded;
        res.token = token
        // //pass control to the next middleware function
        next();
    } catch (ex) {
        console.log('auth Exception', ex);
        res.status(400).send('Invalid token');
    }
}

module.exports = auth;