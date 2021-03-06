var express = require("express");
var exphbs  = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


var PORT = process.env.PORT || 3000;





// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));



const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
const mongoose_options = { useNewUrlParser: true };
const HTML_PATH = __dirname + "/public/";

mongoose.connect(MONGODB_URI, mongoose_options, function (err) {
  if (err) {
    console.log("ERROR connecting to: " + MONGODB_URI + ". " + err);
  } else {
    console.log("Succeeded connected to: " + MONGODB_URI);
  }
});

// Require all models
var db = require("./models");
// Routes
var url = "https://www.espn.com/nba/"
// A GET route for scraping the espn website
app.get("/scrape", function (req, res) {
console.log("asdfasdfasdf");
  axios.get(url).then(function (response) {

    // First, we grab the body of the html with axios
    // request (axios, function (err, resp, body))
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data)



    // Now, we grab every h2 within an article tag, and do the following:
    $(".contentItem__content").each(function (i, element) {
      // Save an empty result object
      var result = {};

      result.link = $(this)
        .children("a")
        .attr("href");

      result.link = "www.espn.com" + result.link;

      result.title = $(this)
        .children("a")
        .children(".contentItem__contentWrapper")
        .children(".contentItem__titleWrapper")
        .children("h1")
        .text()

      result.image = $(this)
        .children("a")
        .children("figure")
        .children("picture")
        .children("img")
        .attr("src")




      console.log("in server.js result image")
      console.log(result.image);
      result.image = "https://a.espncdn.com/combiner/i?img=/photo/2018/0307/r337930_1296x729_16-9.jpg"
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    // res.send("Scrape Complete");
    res.sendFile(path.join(HTML_PATH + '/results.html'));
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {

  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
