"use strict"; 

var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var recipe;

// Custom schema for a recipe
// The recipes will be stored 
// in db along with their reviews
// that you have entered

var recipeSchema = new Schema({
  publisher    : String, 
  ingredients  : [String],
  imageUrl     : String,
  publisherUrl : String,
  title        : String, 
  review       : String
});

recipe = mongoose.model("Recipe", recipeSchema);
exports.recipe = recipe;
