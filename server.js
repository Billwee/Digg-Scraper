// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var morgan = require("morgan");

// Setting the port
var PORT = process.env.PORT || 8080;

// Express app.
var app = express();

// I liked this logger from out activities so I threw it in
app.use(morgan("dev"));

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes for Express
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// Connect to Mongo
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/diggScraper";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});

//Start Server
app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});
