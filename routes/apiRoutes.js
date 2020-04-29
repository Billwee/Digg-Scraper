var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
  //Scrape route
  // Uses axios and cheerio to load everything into mongoose. I threw 
  // in some conditionals: One that fixes links hosted on their servers,
  // one that prevents duplicate articles from being loaded, and another 
  // that changes a boolean value before pushing to the DB. If the article if
  // found in the saved collection it sets it true and handlebars loads
  // a different button for it. 
  app.get("/scrape", (req, res) => {

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

        db.Article.findOne({ desc: article.desc }, (err, data) => {
          if (!data) {
            db.Save.findOne({ altHead: article.altHead }, (err, data) => {
              if (data) {
                console.log("//////////////////IN SAVED///////////////////", data);
                article.saved = true;
                db.Article.create(article, (err, data) => {
                  if (err) throw err;
                });
              } else {
                article.saved = false;
                db.Article.create(article, (err, data) => {
                  if (err) throw err;
                });
              }
            });
          } else {
            console.log("DUPLICATE")
          }
        })

      });
      res.redirect("back");
    });
  });

  //Deletes all articles from the DB
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

  // Route that changed the saved boolean to true for handlebars and saves it 
  // to the saved collection
  app.post("/save/:id", (req, res) => {
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

  // Route for craeting notes and saving relation data to its article
  app.post("/savenote/:id", (req, res) => {
    db.Note.create(req.body)
      .then(function (data) {
        return db.Save.findOneAndUpdate(
          { _id: req.params.id },
          { note: data._id },
          { new: true }
        );
      })
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //Get route for pulling notes related to the article clicked
  app.get("/notes/:id", (req, res) => {
    db.Note.find({ artID: req.params.id }).then((data) => {
      res.json(data);
    });
  });

  //Deltes saved article and resets its saved boolean  to false in 
  //the articles db. It also deletes all notes related to the article
  app.delete("/delete/:id", (req, res) => {
    db.Save.findOneAndDelete({ _id: req.params.id }).then((data) => {
      db.Article.findOneAndUpdate(
        { altHead: data.altHead },
        { saved: false }
      ).then((data) => {
        db.Note.deleteMany({ artID: req.params.id }).then((data) => {
          res.end();
        });
      });
    });
  });

  //Deletes a single note 
  app.delete("/deleteNote/:id", (req, res) => {
    db.Note.deleteOne({ _id: req.params.id }, (err, data) => {
      res.send(data);
    });
  });
};
