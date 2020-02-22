
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const customers = require("./routes/customers");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const addMovies = require("./routes/viewRoutes/addMovies"); //admin pg
const deleteMovie = require("./routes/viewRoutes/getDeleteMovie"); //admin pg
const reviews = require('./routes/reviews');
const carts = require('./routes/carts');
const getUsers = require('./routes/viewRoutes/getUsers'); //get user view for admin pg
const getCreateAdmin = require('./routes/viewRoutes/getCreateAdmin'); //get user view for admin pg
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// require('./startup/routes')(app);
require("./routes/html")(app);
// require('./startup/db')();
//require("./startup/config")();
//mongoose.connect(process.env.MONGODB_URI);

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/rentals", rentals);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/addMovie", addMovies);
app.use("/api/getDeleteMovie", deleteMovie);
app.use('/api/reviews', reviews);
app.use('/api/carts', carts);
app.use('/api/getUsers', getUsers);
app.use('/api/getCreateAdmin', getCreateAdmin);
const TEST_URI = "mongodb://localhost/vidly_node";

mongoose
  .connect(process.env.MONGODB_URI || TEST_URI, { useNewUrlParser: true })
  .then(function() {
    console.log("Connected to MongoDB!!");
  })
  .catch(function() {
    console.log("Error connecting to MongoDB");
  });

// if (process.env.MONGODB_URI) {
//     mongoose.connect(process.env.MONGODB_URI);
// } else {
//     //const db = config.get('db')
//     mongoose.connect("mongodb://localhost/vidly_node", { useNewUrlParser: true })
//         .then(function () {
//             console.log(`Connected to MongoDB!!!!!`)
//         }).catch(function (ex) {
//             console.log('Error connecting to MongoDB');
//         });
// }

const PORT = process.env.PORT || 8888;
// const environment = `Environment: ${process.env.NODE_ENV}`;
// console.log(environment);
const server = app.listen(PORT, function() {
  console.log(`App listening on PORT: ${PORT}`);
});

module.exports = server;
