var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    Admin = require("./models/admin"),
    Product = require("./models/product"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")

var productRoute = require("./routes/products"),
    indexRoutes = require("./routes/index")


passportLocalMongoose = require("passport-local-mongoose")

app.use(bodyParser.urlencoded({ extended: true }))


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb+srv://klatuns:inventory123@inventory.lc1xu.gcp.mongodb.net/inventory?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
// CONFIGURING PASSPORT
app.use(require("express-session")({
    secret: "this is a product",
    resave: false,
    saveUninitialized: false
}));
var Schema = mongoose.Schema;
var Model = mongoose.model;


app.use(passport.initialize());
app.use(passport.session());
passport.use('user', new LocalStrategy(User.authenticate()));
passport.use('admin', new LocalStrategy(Admin.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    if (user != null)
        done(null, user);
});
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

///admin login passport
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use('admin', new LocalStrategy(Admin.authenticate()));
//MIDDLEWARE
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    next();
});
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());
app.use(indexRoutes);
app.use(productRoute);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 1234;
}
app.listen(port, function(req, res) {
    console.log("THE PRODUCT SERVER IS RUNNING ON PORT 1234")
});