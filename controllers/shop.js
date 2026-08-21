
const Product = require("../models/products");
const Order = require("../models/order");
const User = require("../models/user");
const { ObjectId } = require("mongodb");

// get products 
exports.getProducts = (req, res, next) => {

    Product.find().then((products) => {
             res.render("shop/products-list", { prods: products, pageTitle: "Shop", path: "/",isAuthenticated:req.session.isLoggedIn });

    }).catch((err) => {
        console.log(err);
    });
}
//get product
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then((product) => {
        console.log(" product ",product);
          res.render("shop/product-details", { product: product, pageTitle: product.title, path: "/products",isAuthenticated:req.session.isLoggedIn });
    }).catch((err) => {
        console.log(err);
    });
}
//get index 
exports.getIndex = (req, res, next) => {
    Product.find().then((products) => {
      res.render("shop/index", { prods: products, pageTitle: "Shop", path: "/",isAuthenticated:req.session.isLoggedIn });
    }).catch((err) => {
        console.log(err);
    });

}
//get cart
exports.getCart = (req, res, next) => {
    req.user.getCart().then((products)=>{
        console.log(products);
        res.render("shop/cart", { pageTitle: "Cart", path: "/cart", products:products,isAuthenticated:req.session.isLoggedIn});
    }).catch((err)=>{
        console.log(err);
    });
 
}
//get checkout
exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout",isAuthenticated:req.session.isLoggedIn });
}

exports.postCart = (req, res, next) => {
    
    const prodId = req.body.productId;
    
    Product.findById(prodId).then((product)=>{
        return req.user.addToCart(product);
    }).then((result)=>{
        res.redirect("/cart");
    }).catch((err)=>{
        console.log(err);
    });
}
exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteCartItem(prodId).then((result)=>{
        res.redirect("/cart");
    }).catch((err)=>{
        console.log(err);
    });
    
}
exports.postOrder = (req,res,next)=>{
    req.user.addOrder().then((result)=>{
        res.redirect("/orders");
    }).catch((err)=>{
        console.log(err);
    });
}

//get orders
exports.getOrders = (req, res, next) => {
    req.user.getOrders().then((orders)=>{
        console.log("orders :",orders);
        res.render("shop/orders", {
            pageTitle: "Your Orders",
            path: "/orders",
            orders: orders,
            isAuthenticated:req.session.isLoggedIn
        });
    }).catch((err)=>{
        console.log(err);
    });
}