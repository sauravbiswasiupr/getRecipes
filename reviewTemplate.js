"use strict";

var _ = require("lodash");
var path = require("path");
var fs = require("fs");

var template = path.join(__dirname + "/currentRecipes.html");
var uTemplate = _.template(fs.readFileSync(template));
var result;

var generateRecipeHTML = function(data) {
  return uTemplate({
    recipes: data
  });
};
exports.generateRecipeHTML = generateRecipeHTML;
