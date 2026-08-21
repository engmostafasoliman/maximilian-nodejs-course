const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const path = require("path");
const errorController = require("./controllers/errors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const Product = require("./models/products");
const User = require("./models/user");
const MONGODB_URI = 'mongodb+srv://devmostafasoliman_db_user:TvL2qEKQsoLuTR1a@cluster0.hqnkpd7.mongodb.net/shop?appName=Cluster0';
const store = new MongoDBStore({uri:MONGODB_URI,collection:"sessions"});

// const Cart = require("./models/cart");
// const CartItem = require("./models/cat-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));
app.use(session({secret:"mysecretkey",resave:false,saveUninitialized:false,store:store}));

app.set("view engine","ejs");
app.set("views","views");

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id).then((user)=>{
        req.user = user;
        next();
    }).catch((err)=>{
        console.log(err);
    });
});

app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use(authRoutes);
app.use("/admin",adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
mongoose.connect(MONGODB_URI).then((result)=>{    
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

