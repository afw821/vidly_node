const Joi = require("joi");
const { User } = require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const ash = require("express-async-handler");

//POSTING A LOGIN------VALIDATING AN EXISTING USER AND LOGGING HIM IN
router.post(
  "/",
  ash(async function (req, res) {
    const result = validateUser(req.body);
    if (result.error)
      return res.status(404).send(result.error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("invalid email or password");
    //validate password, plain text PW, Hashed PW, Returns a boolean
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //if password is invalid send bad request back to the client
    if (!validPassword)
      return res.status(400).send("invalid email or password");
    //generate auth token from schema method in user.js
    const token = user.generateAuthToken(); //token generated in user.js
    res.header("x-auth-token", token).send(token);
  })
);
//authenticate if user is an administartor
router.post(
  "/admin",
  ash(async function (req, res) {
    const result = validateUser(req.body);
    if (result.error)
      return res.status(404).send(result.error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");
    if (!user.isAdmin)
      return res.status(400).send("User is not an Administrator");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    //generate auth token from schema method in user.js
    const token = user.generateAuthToken(); //token generated in user.js
    res.header("x-auth-token", token).header("UserName", user.name).json({
      token: token,
      username: user.name,
    });
  })
);

//define a validate user function to validate the user input
function validateUser(user) {
  //define a schema to validate ( we are validating the name)
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  //return validated schema vaidate it against genre
  return Joi.validate(user, schema);
}
module.exports = router;
