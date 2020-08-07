const { User, validate } = require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ash = require("express-async-handler");
const welcomeMessage = require("./NodeMailer/nodemailer");

router.get(
  "/me",
  auth,
  ash(async function (req, res) {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  })
);
//register a user
router.post(
  "/",
  ash(async function (req, res) {
    const result = validate(req.body);
    const name = req.body.name;
    const email = req.body.email;
    if (result.error)
      return res.status(404).send(result.error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");
    //else create the new user
    user = new User({
      name: name,
      email: email,
      password: req.body.password,
      isAdmin: false,
      cartId: null,
    });
    //salt and has passord using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //save the new user
    await user.save();
    //generate jwt with function in user.js
    const token = user.generateAuthToken();
    //after generating the token set it to the response header
    //exclude the password from being sent
    //res.header('x-auth-token', token);
    welcomeMessage(email, name);

    res.send(user);
  })
);

router.get(
  "/",
  [auth, admin],
  ash(async function (req, res) {
    const users = await User.find();
    res.send(users);
  })
);

router.put(
  "/:id",
  [auth, admin],
  ash(async function (req, res) {
    console.log("req body", req.body);
    console.log("req params id", req.params.id);
    const result = validate(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
        isAdmin: false,
      },
      { new: true }
    );

    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send({ status: true, user: user });
  })
);

module.exports = router;
