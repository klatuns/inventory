var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AdminSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    key: Number
});

AdminSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Admin", AdminSchema);