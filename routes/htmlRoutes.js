var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
  app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, "../views/layouts/main"));
    db.Article.find({}, function (err, data) {
      // console.log(data);
      res.render("index", { obj: data });
    });
  });

  app.get("/saved", (req, res) => {
    db.Save.find({}, function (err, data) {
      // console.log(data);
      res.render("saved", { obj: data });
    });
  });
};
