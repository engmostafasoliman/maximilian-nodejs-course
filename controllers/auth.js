const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendSignupEmail, sendResetEmail } = require("../util/email");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", { pageTitle: "Login", path: "/login",isAuthenticated:req.session.isLoggedIn, errorMessage: req.flash("error") });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email}).then((user)=>{
        if(!user){
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }
        bcrypt.compare(password, user.password).then((doMatch)=>{
            if(!doMatch){
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
            }
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
            res.redirect("/login");
        });
    }).catch((err)=>{
        console.log(err);
    });
}

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", { pageTitle: "Signup", path: "/signup",isAuthenticated:req.session.isLoggedIn, errorMessage: req.flash("error") });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password !== confirmPassword){
        req.flash("error", "Passwords do not match.");
        return res.redirect("/signup");
    }
    User.findOne({email:email}).then((existingUser)=>{
        if(existingUser){
            req.flash("error", "E-Mail already exists, please pick a different one.");
            return res.redirect("/signup");
        }
        return bcrypt.hash(password,12).then((hashedPassword)=>{
            const user = new User({email:email,password:hashedPassword,name:"Mostafa Soliman", cart:{items:[]}});
            return user.save();
        }).then((result)=>{
            res.redirect("/login");
            return sendSignupEmail(email);
        });
    }).catch((err)=>{
        console.log(err);
    });
}

exports.getReset = (req, res, next) => {
    res.render("auth/reset", { pageTitle: "Reset Password", path: "/reset", errorMessage: req.flash("error") });
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                req.flash("error", "No account with that email found.");
                return res.redirect("/reset");
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save().then(() => {
                res.redirect("/");
                const resetLink = `http://localhost:3001/reset/${token}`;
                return sendResetEmail(email, resetLink);
            });
        }).catch((err) => {
            console.log(err);
        });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then((user) => {
        if (!user) {
            req.flash("error", "Password reset link is invalid or has expired.");
            return res.redirect("/reset");
        }
        res.render("auth/new-password", {
            pageTitle: "New Password",
            path: "/new-password",
            errorMessage: req.flash("error"),
            userId: user._id.toString(),
            passwordToken: token,
        });
    }).catch((err) => {
        console.log(err);
    });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId,
    }).then((user) => {
        if (!user) {
            req.flash("error", "Password reset link is invalid or has expired.");
            return res.redirect("/reset");
        }
        resetUser = user;
        return bcrypt.hash(newPassword, 12).then((hashedPassword) => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        }).then(() => {
            res.redirect("/login");
        });
    }).catch((err) => {
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
