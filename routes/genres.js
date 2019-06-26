const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
//get all genres
router.get('/', async function (req, res) {
    try {
        const genres = await Genre.find();
        res.send(genres);
    } catch (exception) {
        console.log(exception);
    }
});
//get genre by id
router.get('/:id', async function (req, res) {
    try {
        const genre = await Genre.findById(req.params.id);
        //if course doesn't exist return 404
        if (!genre) {
            res.status(404).send("The requested id doesn't exist");
            return;
        }
        //return genre to the client
        res.send(genre);
    } catch (ex) {
        console.log('FATAL ERROR::', ex);
    }

});
//post a genre
router.post('/', auth, async function (req, res) {
    try {
        //validate the req.body object
        const result = validate(req.body);
        //if invalid return a 404 error to the client
        if (result.error) {
            res.status(404).send(result.error.details[0].message);
            return;
        }
        //define the object that you want to post(push to array)
        let genre = new Genre({ name: req.body.name })
        //else push the course object to the course array
        genre = await genre.save();
        //send the response back to the client
        res.send(genre);
    } catch (ex) {
        console.log('FATAL ERROR::', ex);
    }

});
//put(replace) route
router.put('/:id', auth, async function (req, res) {
    try {
        //validate user input
        const result = validate(req.body);
        //if invalid return 400 bad request
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true // new true returns the new updated genre
        });
        //if the requested course doesn't exist return 404
        if (!genre) {
            res.status(404).send("The requested genre doesn't exist");
            return;
        }
        //send response to the client
        res.send(genre);
    } catch (ex) {
        console.log('FATAL ERROR', ex);
    }

});
router.delete('/:id', [auth, admin], async function (req, res) {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        //if genre doesn't exist send 404 error to the client
        if (!genre) {
            res.send(404).send("the requested genre doesn't exist");
            return;
        }
        //return removed genre from the array
        res.send(genre);
    } catch (ex) {
        console.log('FATAL ERROR::', ex);
    }

});
module.exports = router;