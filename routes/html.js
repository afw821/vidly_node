const path = require("path");
const auth = require("../middleware/auth");
module.exports = function (app) {
  app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  app.get("/homepage", function (req, res) {

    res.sendFile(path.join(__dirname, "../public/home.html"));

  });

  app.get("/checkout", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/checkout.html"));
    //res.redirect('/login');
  });

  app.get("/admin", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/admin.html"));
  });
};
