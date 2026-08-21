const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const path = require("path");
const isAuth = require("../middleware/is-auth");
//get admin products
router.get("/products", isAuth, adminController.getProducts);
//get add product
router.get("/add-product", isAuth, adminController.getAddProduct);
//post admin product
router.post("/add-product", isAuth, adminController.postAddProduct);
// //get edit product
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
// //post edit product
router.post("/edit-product", isAuth, adminController.postEditProduct);
// //post delete product
router.post("/delete-product", isAuth, adminController.postDeleteProduct);
module.exports = router;

