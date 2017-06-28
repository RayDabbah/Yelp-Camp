const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require("passport");
const middleware = require('../middleware');

router.get("/", (req, res) => {
    res.render("landing");
});
// Auth Routes
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            console.log(err)
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", `Welcome to Yelp Camp, ${user.username}! We're excited to have you on board!`)
                res.redirect("/campgrounds");
            });
        }
    });

});

// Login
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have been logged out!")
    res.redirect("back");
});

router.get("*", (req, res) => res.redirect("/"));

module.exports = router;
