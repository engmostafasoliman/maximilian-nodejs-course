
const Product = require("../models/products");
exports.getAddProduct = (req, res, next) => {
    res.status(200).render("admin/edit-product", { pageTitle: "Add Product", path: "/admin/add-product",editing:false,isAuthenticated:req.isLoggedIn});

}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageurl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({title :title ,imageUrl:imageUrl,price:price,description:description,userId:req.user});
    product.save().then((result) => {
        console.log("created");
        res.redirect("/admin/products",{isAuthenticated:req.isLoggedIn}); 
    }).catch((err) => {
        console.log(err);
    });
}


exports.getProducts = (req, res, next) => {
    Product.find().select("title imageUrl price description").populate("userId","name email").then((products) => {
        res.render("admin/products", { prods: products, pageTitle: "Admin Products", path: "/admin/products",isAuthenticated:req.isLoggedIn });
    }).catch((err) => {
        console.log(err);
    });
}
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageurl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    
    Product.findById(prodId).then((product) => {
        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;
        product.description = updatedDescription;
        return product.save();
    }).then(() => {
        res.redirect("/admin/products",{isAuthenticated:req.isLoggedIn});
    }).catch((err) => {
        console.log(err);
        
    });
}
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    
    Product.findByIdAndDelete(prodId).then((product) => {
        console.log("deleted");
        res.redirect("/admin/products",{isAuthenticated:req.isLoggedIn});
    }).catch((err) => {
        console.log(err);
        
    });
}
    exports.getEditProduct = (req, res, next) => {
        const editMode = req.query.edit;
        if(!editMode){
            return res.redirect("/admin/products",{isAuthenticated:req.isLoggedIn});
        }
        const prodId = req.params.productId;
        if(!prodId){
            return res.redirect("/admin/products",{isAuthenticated:req.isLoggedIn});
        }
        Product.findById(prodId).then((product) => {
            res.render("admin/edit-product",
                 { product: product,
                 pageTitle: "Edit Product",
                 path: "/admin/edit-product",
                editing : editMode
             });
        }).catch((err) => {
            console.log(err);
        });
    }

    
