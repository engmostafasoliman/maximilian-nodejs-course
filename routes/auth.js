const express = require("express");
const router = express.Router();

router.get("/login", (req, res, next) => {
    res.render("auth/login", { pageTitle: "Login", path: "/login", });
});

module.exports = router;