var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
  app.get("/scrape", (req, res) => {
    db.Article.deleteMany({})
      .then((data) => {})
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

        db.Article.create(article)
          .then((data) => {
            // console.log(data);
          })
          .catch((err) => {
            console.log(err);
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
