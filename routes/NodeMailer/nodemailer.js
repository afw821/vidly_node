const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

function sendEmail(email, name){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Thanks',
    text: `Thanks for signing up for the site ${name}!`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send({ status: true, data: info.response })
    }
  });
}

module.exports = sendEmail;