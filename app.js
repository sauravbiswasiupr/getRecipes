"use strict"; 

var express = require("express");
var mongoose = require("mongoose");
var unirest  = require("unirest");
var querystring = require("querystring");

var recipe = require("./schema").recipe;
var generateHTML = require("./recipeTemplate").generateHTML;
var searchHTML  = require("./searchTemplate").searchHTML;
var generateRecipeHTML = require("./reviewTemplate").generateRecipeHTML;

var API_KEY = "4413e3db88b717d83a2d6247298fcc31";

var app = express();
mongoose.connect("mongodb://localhost/recipeReviews");

app.set("view options", { layout: false });
app.use(express.static(__dirname + "/"));

app.use(express.bodyParser());

app.get("/", function(req, res) {
  res.sendfile("login.html");
});

app.post("/login/searchResults", function(req, res) {
  var query = querystring.stringify({ q: req.body.searchtext });
  var url = "https://community-food2fork.p.mashape.com/search?key=" + API_KEY +"&" +query; 
  unirest.get(url)
  .header("X-Mashape-Key", "hEVdhSi1XDmshxl4deeJLG812M7Tp1S7vqCjsnIc0ViZFqU0CJ")
  .end(function (result) {
    var parsedResult = JSON.parse(result.body);
    var recipes = parsedResult.recipes;
   
    var html = searchHTML(recipes);
    res.send(html);
  });
});

app.get("/currentRecipes", function(req, res) {
 recipe.find(function(err, data) {
   if (err)
     console.log(err);
   if (data.length === 0)
     res.send("No reviews to show");
   else {
     var html = generateRecipeHTML(data);
     res.send(html);
   }
 });

});

app.post("/seeRecipe", function(req, res) {
  var id = req.body.recipeId;   
  var getUrl ="https://community-food2fork.p.mashape.com/get?key=" + API_KEY + "&rId=" + id;
  unirest.get(getUrl)
  .header("X-Mashape-Key", "hEVdhSi1XDmshxl4deeJLG812M7Tp1S7vqCjsnIc0ViZFqU0CJ")
  .end(function (result) { 
    var parsedResult = JSON.parse(result.body);
    var recipe = parsedResult.recipe;

    var publisher    = recipe.publisher;
    var ingredients  = recipe.ingredients; 
    var imageUrl     = recipe.image_url;
    var publisherUrl = recipe.publisher_url;
    var title        = recipe.title;
    
    var html = generateHTML({
      publisher    : publisher,
      ingredients  : ingredients, 
      imageUrl     : imageUrl,
      publisherUrl : publisherUrl, 
      title        : title
    });
    res.send(html);
  });
});

app.post("/submitReview", function(req, res) {
  var newRecipe = new recipe;
  newRecipe.title        = req.body.title;
  newRecipe.publisher    = req.body.publisher; 
  newRecipe.publisherUrl = req.body.publisherUrl;
  newRecipe.imageUrl     = req.body.imageUrl; 
  newRecipe.ingredients  = req.body.ingredients; 
  newRecipe.review       = req.body.review;

  newRecipe.save(function(err) {
    if (err)
      console.log("Error while saving to db: ", db);
    else {
      res.sendfile("reviewSubmit.html");
    }
  });
});

app.listen(3000, "127.0.0.1", function(err, result) {
  if (err)
    console.log("error while starting app: ", err);
  else
    console.log("App is running");
});
  
