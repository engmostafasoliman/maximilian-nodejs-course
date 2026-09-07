const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
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

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", { pageTitle: "Signup", path: "/signup",isAuthenticated:req.session.isLoggedIn });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password !== confirmPassword){
        return res.redirect("/signup");
    }
    User.findOne({email:email}).then((existingUser)=>{
        if(existingUser){
            return res.redirect("/signup");
        }
        return bcrypt.hash(password,12).then((hashedPassword)=>{
            const user = new User({email:email,password:hashedPassword, cart:{items:[]}});
            return user.save();
        }).then((result)=>{
            res.redirect("/login");
        }).catch((err)=>{
            console.log(err);
        });
    }).catch((err)=>{
        console.log(err);
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
        res.redirect("/");
    });
}
