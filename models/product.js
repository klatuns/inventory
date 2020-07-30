var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Model = mongoose.model;
//Product Schema

var productSchema = new Schema ({
   code: String,
   name: String,
   description: String,
   price: Number,
   quantity: Number
   
});

var Product = Model("Product", productSchema);

module.exports = mongoose.model("Product", productSchema);