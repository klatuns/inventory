var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    Admin = require("./models/admin"),
    Product = require("./models/product"),
    mongoose = require ("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")
    
    var productRoute  = require("./routes/products"),
        indexRoutes   = require("./routes/index")


    passportLocalMongoose = require("passport-local-mongoose")
    
    app.use(bodyParser.urlencoded({extended: true}))
    
   
    app.set("view engine", "ejs");
    app.use( express.static( "public" ) );
    app.use(methodOverride("_method"));
    app.use(flash());

    mongoose.connect("mongodb://localhost/inventory", 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true ,
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
    if(user!=null)
      done(null,user);
  });
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

///admin login passport
// app.use(passport.initialize());
// app.use(passport.session());
passport.use('admin', new LocalStrategy(Admin.authenticate()));
//MIDDLEWARE
app.use (function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.message = req.flash("error");
    next();
});
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());
app.use (indexRoutes);
app.use(productRoute);
app.listen(1234, function(req, res){
        console.log("THE PRODUCT SERVER IS RUNNING")
    });