module.exports = function (req, res, next) {
    //middleware function for if user is an admin or not
    if(!req.user.isAdmin) return res.status(403).send('Access Denied');

    next();
}