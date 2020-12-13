var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Model = mongoose.model;
//History Schema

var historySchema = new Schema({
    code: String,
    name: String,
    price: Number,
    quantity: Number,
});

var History = Model("History", historySchema);

module.exports = mongoose.model("History", historySchema);