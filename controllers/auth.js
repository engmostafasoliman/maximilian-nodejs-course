const User = require("../models/user");

exports.getLogin = (req, res, next) => {
// const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1] === "true";
    console.log(req.session.isLoggedIn);
    res.render("auth/login", { pageTitle: "Login", path: "/login",isAuthenticated:req.session.isLoggedIn });
}

exports.postLogin = (req, res, next) => {
    User.findById("6a82b5d4bf2753f132ec2d40").then((user)=>{
        req.session.user = JSON.parse(JSON.stringify(user));
        req.session.isLoggedIn = true;
        req.session.save((err)=>{
            if(err){
                console.log(err);
            }
            res.redirect("/");
        });
    }).catch((err)=>{
        console.log(err);
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect("/");
    });
}