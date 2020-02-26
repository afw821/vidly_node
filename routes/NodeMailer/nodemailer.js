const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const ash = require('express-async-handler');
const dotenv = require('dotenv');

dotenv.config();

router.get('/sendmail', ash(async function (req, res) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: req.body.email,
    subject: 'Thanks',
    text: `Thanks for signing up for the site ${req.body.name}!`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send({ status: true, data: info.response })
    }
  });
}));

module.exports = router;