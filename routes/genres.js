const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const ash = require('express-async-handler');

router.get('/', ash(async function (req, res) { 
        const genres = await Genre.find();
        res.send(genres);        
}));

router.get('/:id', ash(async function (req, res) {
        const genre = await Genre.findById(req.params.id);  
        console.log('genre', genre);   
        if (!genre) return  res.status(404).send("The requested id doesn't exist");
        res.send(genre);
}));

router.post('/', ash(async function (req, res) {
        const result = validate(req.body);
        if (result.error) return  res.status(404).send(result.error.details[0].message);
        let genre = new Genre({ name: req.body.name })
        genre = await genre.save();
        res.send(genre);
}));

router.put('/:id', auth, ash(async function (req, res) {
        const result = validate(req.body);
        if (result.error) return  res.status(400).send(result.error.details[0].message);        
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true // new true returns the new updated genre
        });
        if (!genre) return  res.status(404).send("The requested genre doesn't exist");
        res.send(genre);
}));

router.delete('/:id', [auth, admin], ash(async function (req, res) {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre) return  res.status(404).send("the requested genre doesn't exist");        
        res.send(genre);
}));
module.exports = router;