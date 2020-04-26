var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
  app.get("/", function (req, res) {
    // res.sendFile(path.join(__dirname, "../views/layouts/main"));
    var crap;
    db.Article.find({})
      .then((data) => {
        // console.log(data);
        res.render("index", { obj: data });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
