const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    //const db = config.get('db')
    console.log("Made it here--------------------");
    mongoose
      .connect("mongodb://localhost/vidly_node", { useNewUrlParser: true })
      .then(function () {
        console.log(`Connected to MongoDB!!!!!`);
      })
      .catch(function (ex) {
        console.log("Error connecting to MongoDB");
      });
  }
};
