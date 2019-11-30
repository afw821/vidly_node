const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ash = require('express-async-handler');
const admin = require('../middleware/admin');

router.get("/", auth, ash(async function (req, res) {
  const movies = await Movie.find();
  res.send(movies);
}));

router.post("/", [auth, admin], ash(async function (req, res) {

  const result = validate(req.body);
  if (result.error) return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");
  //create a new movie object with the genre _id and name properties
  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();
  res.send({
    result: true,
    movie: movie
  });
}));

router.put("/:id", auth, ash(async function (req, res) {
  const result = validate(req.body);
  if (result.error) return res.status(400).send(result.error.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");
  //define a new movie object to update after find by id
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie) return res.status(404).send("The movie with the given ID was not found.");
  res.send(movie);
}));

router.get("/:id", ash(async function (req, res) {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("The movie with the requested id was not found.");
  res.send(movie);
}));

router.post("/search/name", ash(async function (req, res) {
  var regexstring = req.body.title;
  var regexp = new RegExp(regexstring, "gi");
  const movie = await Movie.find({ title: regexp });
  console.log('search movie', movie);
  if (!movie || movie.length == 0) return res.status(404).send("The movie with the requested title was not found.");
  res.send({ result: true, movie: movie });
}));

router.delete("/:id", [auth, admin], ash(async function (req, res) {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("The movie with the given ID was not found.");
  res.send({ result: true, movieDeleted: movie });
}));

module.exports = router;
