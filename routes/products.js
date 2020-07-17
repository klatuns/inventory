var express = require ("express");
var router = express.Router();
var Product = require("../models/product");
const User = require("../models/user");
const Admin = require("../models/admin");



//THE HOMEPAGE
router.get("/",isLoggedIn, function(req, res){
    Product.find({}, function(err, allProducts){
        if(err){
            
            console.log(err);
        } else {
            
            res.render("home",{products: allProducts});
           
        }
    })
});



//NEW PRODUCT PAGE
router.get("/admin/newproduct", isLoggedInAdmin, function(req, res){
    res.render("newproduct")
})
//SALES PAGE
router.get("/sale",isLoggedIn, function(req, res){
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
router.post("/sale", isLoggedInAdmin, function(req, res){
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
            res.redirect("/admin/products");
            
        }
    });
});

//EDITING PRODUCT
router.get("/sale/:id/edit", isLoggedInAdmin, (req, res)=>{
    Product.findById(req.params.id, (err, foundProduct)=>{
        res.render("edit", {product: foundProduct});
    });
});

// UPDATE PRODUCT ROUTE
router.put("/sale/:id",isLoggedInAdmin, function(req, res){
    // find and update the correct product
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
       if(err){
           res.redirect("/admin/products");
       } else {
           //redirect somewhere(Product page)
           res.redirect("/admin/products");
       }
    });
});

// UPDATING THE QUANTITY
router.put("/product/:id", (req, res)=>{
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
//ADMIN PAGE 
router.get("/admin", isLoggedInAdmin, function(req, res){
  
            res.render("adminPage");
    });
//ADMIN USERS PAGE
router.get("/admin/users", isLoggedInAdmin, function(req, res){
    User.find({}, function(err, allUsers){
        if(err){
            
            console.log(err);
        } else {
            
            res.render("adminUsers",{users: allUsers});
           
        }
    })
});
//ADMIN PRODUCTS LIST
router.get("/admin/products",isLoggedInAdmin, function(req, res){
    Product.find({}, function(err, allProducts){
        if(err){
            
            console.log(err);
        } else {
            
            res.render("adminproduct",{products: allProducts});
           
        }
    })
});

// DELETE ROUTE
router.delete("/sale/:id", isLoggedInAdmin, function(req, res){
    //findByIdAndRemove
    Product.findByIdAndDelete(req.params.id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/");
       }
    });
});

// USER DELETE ROUTE
router.delete("/admin/:id", isLoggedInAdmin, function(req, res){
    //findByIdAndRemove
    User.findByIdAndDelete(req.params.id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/admin");
       }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        
        return next();
    }
    req.flash("error", "You have to be logged in");
    res.redirect("/login");
};
function isLoggedInAdmin(req, res, next){
    if(!req.user || req.user.key == null){
        
        req.logout();
        res.redirect("/admin/login");
        
        
    } else {
        
        return next();
        
    }
    
  
   
}
module.exports = router;