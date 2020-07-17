const Admin = require("../models/admin");

//all middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You have to be logged in");
    res.redirect("/login");
};

middlewareObj.isLoggedInAdmin = 
function (req, res, next){
    if(!req.user || req.user.key == null){
        
        req.logout();
        res.redirect("/admin/login");
        
        
    } else {
        
        return next();
        
    }
  
   
}

module.exports = middlewareObj;