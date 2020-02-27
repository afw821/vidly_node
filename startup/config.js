const config = require('config');

module.exports = function () {
    
    //have to set this environment variable first
    //if it doesn't exist then exit the progra
    //export vidly_node_jwtPrivateKey=mySecureKey
    // if(!config.get('jwtPrivateKey')){
    //     throw new Error('FATAL ERROR: jwt private key is not defined');
    // }
}