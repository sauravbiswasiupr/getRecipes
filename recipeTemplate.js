"use strict";

var _ = require("lodash");
var path = require("path");
var fs = require("fs");

var template = path.join(__dirname + "/submitReview.html");
var uTemplate = _.template(fs.readFileSync(template));
var result;

var generateHTML = function(data) {
  return uTemplate({
    publisher    : data.publisher,
    ingredients  : data.ingredients,
    imageUrl     : data.imageUrl,
    publisherUrl : data.publisherUrl,
    title        : data.title
  });
};
exports.generateHTML = generateHTML;
