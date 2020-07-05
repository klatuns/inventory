var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    mongoose = require ("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")
    //seedDB      = require("./seeds"),
    passportLocalMongoose = require("passport-local-mongoose")
    
    app.use(bodyParser.urlencoded({extended: true}))
    
   
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(function(req, res, next){
//     req.locals.currentUser = req.user;
//     req.locals.message = req.flash("error");
//     next();
// })

//Products Schema
var productSchema = new Schema ({
    code: String,
    name: String,
    description: String,
    price: Number,
    quantity: Number
    
});

var Product = Model("Product", productSchema);




app.get("/",isLoggedIn, function(req, res){
    Product.find({}, function(err, allProducts){
        if(err){
            console.log(err);
        } else {
            
            res.render("home",{products:allProducts});
           
        }
    })
           
        
});

app.get("/sale",isLoggedIn, function(req, res){
    // Get all Products from DB
    Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("sale",{products:allProducts});
          
       }
    });
});

//ADDING PRODUCTS TO THE DATABASE
app.post("/sale", function(req, res){
    // get data from form and add to products array
    var code = req.body.code;
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var newProduct = {code:code, name: name, description: description, price: price, quantity: quantity}
    // CREATE A NEW PRODUCT AND SAVE TO DATABASE
    Product.create(newProduct, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Product added successfully");
            //redirect back to products page
            res.redirect("/");
            
        }
    });
});

//EDITING PRODUCT
app.get("/sale/:id/edit", (req, res)=>{
    Product.findById(req.params.id, (err, foundProduct)=>{
        res.render("edit", {product: foundProduct});
    });
});

// UPDATE PRODUCT ROUTE
app.put("/sale/:id", function(req, res){
    // find and update the correct product
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
       if(err){
           res.redirect("/");
       } else {
           //redirect somewhere(Product page)
           res.redirect("/");
       }
    });
});

// UPDATING THE QUANTITY
app.put("/product/:id", (req, res)=>{
    Product.findById(req.params.id, (err, foundId)=>{
        if (err){
            console.log(err)
        }
        else {
            const obj = JSON.parse(Object.keys(req.body)[0])
            const quantity = foundId.quantity;
            const newQuantity = quantity - obj.quantity;
            
            Product.findByIdAndUpdate(req.params.id, {quantity: newQuantity}, (err, foundQuantity)=>{
               if (err){
                   console.log(err)
               } else {
                   return res.status(200).json({message: "product updated successfully"});
               }
            })
        }


    } )
})

// DELETE ROUTE
app.delete("/sale/:id", function(req, res){
    //findByIdAndRemove
    Product.findByIdAndDelete(req.params.id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/");
       }
    });
});


//REGISTRATIONS
app.get("/register", function(req, res){
    res.render("register")
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register")
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            })
        }
    })
});
//login route
//render login form
app.get("/login", function(req, res){
    res.render("login", {message: req.flash("error")})
});
//login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/sale",
    failureRedirect: "/login"
}), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You have to be logged in");
    res.redirect("/login");
}




    app.listen(1234, function(req, res){
        console.log("THE PRODUCT SERVER IS RUNNING ON PORT 1234")
    });