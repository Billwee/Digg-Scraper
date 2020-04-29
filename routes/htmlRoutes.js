var db = require("../models");

// Both routes here pull everything for a collection and
// load it into handlebars
module.exports = function (app) {
  app.get("/", (req, res) => {
    db.Article.find({}, function (err, data) {
      res.render("index", { obj: data });
    });
  });

  app.get("/saved", (req, res) => {
    db.Save.find({}, function (err, data) {
      res.render("saved", { obj: data });
    });
  });
};
