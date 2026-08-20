const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const path = require("path");
const errorController = require("./controllers/errors");
const mongoose = require("mongoose");
// const Product = require("./models/products");
const User = require("./models/user");

// const Cart = require("./models/cart");
// const CartItem = require("./models/cat-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));

app.set("view engine","ejs");
app.set("views","views");

app.use((req,res,next)=>{
    User.findById("6a82b5d4bf2753f132ec2d40").then((user)=>{
        req.user = user;
        next();
    }).catch((err)=>{
        console.log(err);
    });
});

app.use(authRoutes);
app.use("/admin",adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
mongoose.connect("mongodb+srv://devmostafasoliman_db_user:TvL2qEKQsoLuTR1a@cluster0.hqnkpd7.mongodb.net/shop?appName=Cluster0").then((result)=>{    
   User.findOne().then((user)=>{
    if(!user){
        const user = new User({name:"mostafa",email:"Devmostafasoliman@gmail.com",cart:{items:[]}}).save(); 
    }
   })
    app.listen(3001); 
}).catch((err)=>{
    console.log(err);
});

module.exports = app;

