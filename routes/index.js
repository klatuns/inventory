var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Admin = require("../models/admin")
var Product = require("../models/product");

//REGISTRATIONS
router.get("/admin/create_user", function (req, res) {
    res.render("register")
});

//handling user sign up
router.post("/admin/create_user", function (req, res) {
    req.body.username
    req.body.password
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register")
        } else {
            passport.authenticate("user")(req, res, function () {
                res.redirect("/admin/users");
            })

        }
    })
});
//login route
//render login form
router.get("/login", function (req, res) {
    res.render("login", { message: req.flash("error") })
});
//login logic
router.post("/login", passport.authenticate("user", {
    
    successRedirect: "/sale",
    failureRedirect: "/login"
    
}), function (req, res) {
    
});

// ADMIN REGISTRATIONS PAGE
router.get("/admin/register", function (req, res) {
    res.render("adminregister")
});

//handling user sign up
router.post("/admin/register", function (req, res) {

    Admin.register(new Admin({ username: req.body.username, key: req.body.key }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("adminregister")
        } else {
            passport.authenticate("admin")(req, res, function () {
                res.redirect("/admin");
            })
        }
    })
});
//Admin login route
//render Admin login form
router.get("/admin/login", function (req, res) {
    res.render("adminlogin", { message: req.flash("error") })
});
//login logic
router.post("/admin/login", function(req, res, next){
    passport.authenticate('admin', function (err, user, info) {
        if (err) {
            return next(err);
        } if (!user) {
            return res.redirect('/admin/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            
            return res.redirect('/admin/products');
            console.log(req.user)
        });
    })(req, res, next);
});

/////new



router.get("/logout", function (req, res) {
    req.logout();
    req.flash("error", "You have been logged out")
    if (currentUser = req.user){
    res.redirect("/");
    } else {
        res.redirect('/admin/login');
    }
});


module.exports = router;