var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Admin = require("../models/admin");
const { isLoggedInAdmin } = require("../middleware");

//REGISTRATIONS
router.get("/admin/create_user", isLoggedInAdmin, function(req, res) {
    res.render("register");
});

//handling user sign up
router.post("/admin/create_user", isLoggedInAdmin, function(req, res) {
    User.register(
        new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        }),
        req.body.password,
        function(err, user) {
            if (err) {
                console.log(err.message);
                return res.render("register");
            } else {
                passport.authenticate("user")(req, res, function() {
                    res.redirect("/admin/users");
                });
            }
        }
    );
});
//login route
//render login form
router.get("/login", function(req, res) {
    res.render("login");
});
//login logic
router.post(
    "/login",
    passport.authenticate("user", {
        successRedirect: "/sale",
        failureRedirect: "/login",
    }),
    function(req, res) {}
);

var error = "Acess Denied";
//REGISTRATIONS

// ADMIN REGISTRATIONS PAGE
router.get("/admin/register", function(req, res) {
    res.render("accform", { Error: "Enter Password" });
});
router.post("/form", (req, res) => {
    var pass = req.body.pass;
    var inpPass = "inputpassword";
    if (pass === inpPass) {
        res.render("adminregister");
    } else {
        res.render("accform", { Error: error });
    }
});
//handling user sign up
router.post("/admin/register", function(req, res) {
    Admin.register(
        new Admin({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            key: req.body.key,
        }),
        req.body.password,
        function(err, user) {
            if (err) {
                console.log(err);
                return res.render("adminregister");
            } else {
                passport.authenticate("admin")(req, res, function() {
                    res.redirect("/admin");
                });
            }
        }
    );
});
//Admin login route
//render Admin login form
router.get("/admin/login", function(req, res) {
    res.render("adminlogin");
});
// login logic
router.post("/admin/login", function(req, res, next) {
    passport.authenticate("admin", function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/admin/login");
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }

            return res.redirect("/admin");
        });
    })(req, res, next);
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("error", "You have been logged out");
    res.redirect("/login");
});

module.exports = router;