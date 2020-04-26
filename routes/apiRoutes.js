var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
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

        article.altHead = altHead.substring(1, altHead.length - 1);
        article.headline = headline.substring(1, headline.length - 1);
        article.desc = desc;
        article.link = link;

        db.Article.exists(article, (err, data) => {
          if (data) {
            console.log("duplicate");
          } else {
            db.Article.create(article)
              .then((data) => {
                // console.log(data);
              })
              .catch((err) => {
                console.log(err);
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
};
