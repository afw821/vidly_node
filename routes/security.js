const Security = require('../models/security');
const express = require('express');
const router = express.Router();
const ash = require('express-async-handler');

router.post('/', ash(async function(req,res){

    let security = new Security({
        question: req.body.question
    });

    security = await security.save();
    if(!security) 
        return res.status(400).send("unable to save question");

    res.send({ status: true, question: security });
}));

module.exports = router;