var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
  app.get("/scrape", (req, res) => {
    db.Article.deleteMany({})
      .then((data) => { })
      .catch((err) => {
        console.log(err);
      });
    axios.get("https://digg.com/").then((response) => {
      let $ = cheerio.load(response.data);

      $(".fp-vertical-story").each((i, element) => {
        let article = {};
        let link = $(element).children("a").attr("href");
        let desc = $(element).children("div.description").children("p").text();
        let altHead = $(element)
          .children("header")
          .children("div.alternativeHeadline")
          .text();
        let headline = $(element)
          .children("header")
          .children("h2")
          .children("a")
          .text();

        article.altHead = altHead.substring(1, altHead.length - 1).trim();
        article.headline = headline.substring(1, headline.length - 1).trim();
        article.desc = desc.trim();
        if (link.charAt(0) === "/") {
          article.link = "https://digg.com" + link.trim();
        } else {
          article.link = link.trim();
        }

        db.Save.findOne({ altHead: article.altHead }, function (err, data) {
          // console.log(data);
          if (data) {
            article.saved = true;
            db.Article.create(article, function (err, data) {
              if (err) throw err;
            });
          } else {
            article.saved = false;
            db.Article.create(article, function (err, data) {
              if (err) throw err;
            });
          }
        });
      });
      res.end();
    });
  });

  app.delete("/clear", (req, res) => {
    db.Article.deleteMany({})
      .then((data) => {
        console.log(data);
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.post("/save/:id", (req, res) => {
    // console.log(req.params.id);
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(
      (data) => {
        console.log(data);
        let clone = {};
        clone.altHead = data.altHead;
        clone.headline = data.headline;
        clone.desc = data.desc;
        clone.link = data.link;
        db.Save.create(clone, (err, data2) => {
          if (err) throw err;
          res.end();
        });
      }
    );
  });

  app.post("/savenote/:id", (req, res) => {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function (data) {
        return db.Save.findOneAndUpdate(
          { _id: req.params.id },
          { note: data._id },
          { new: true }
        );
      })
      .then(function (data) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(data);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/notes/:id", (req, res) => {
    db.Note.find({ artID: req.params.id }).then((data) => {
      res.json(data);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    db.Save.findOneAndDelete({ _id: req.params.id }).then((data) => {
      console.log(data);
      db.Article.findOneAndUpdate(
        { altHead: data.altHead },
        { saved: false }
      ).then((data) => {
        console.log(data);
        db.Note.deleteMany({ artID: req.params.id }).then((data) => {
          console.log(data);
          res.end();
        });
      });
    });
  });

  app.delete("/deleteNote/:id", (req, res) => {
    db.Note.deleteOne({ _id: req.params.id }, (err, data) => {
      res.send(data);
    });
  });
};
