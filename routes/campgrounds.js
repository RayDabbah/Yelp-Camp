const express = require("express");
const router = express.Router();
const campground = require("../models/campgrounds");
const middleware = require('../middleware');
const app = express();
router.get("/", (req, res) => {
  campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", {
        campgrounds: allCampgrounds
      });
    }
  });
});
router.post("/", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var user = req.user.username;
  var price = req.body.price;
  var userId = req.user._id;
  var newCampGround = {
    name: name,
    image: image,
    price: price,
    description: desc,
    author: {
      username: user,
      id: userId
    }
  };
  campground.create(newCampGround, function(err, latestCampground) {
    if (err) {
      res.redirect("/campgrounds/new");
     req.flash('error', "There was en error adding your campground.");
    } else {
      req.flash('success', 'You successfully added your campground! Thank You for your participation!')
      res.redirect("/campgrounds");
    }
  });
});
router.get("/new", middleware.isLoggedIn, (req, res) => res.render("newCampground"));
router.get("/:id", function(req, res) {
  campground
    .findById(req.params.id)
    .populate("comments")
    .exec(function(err, clickedOnCg) {
      if (err) {
        console.log(err);
      } else {
        res.render("show", {
          campground: clickedOnCg
        });
      }
    });
});
router.get("/:id/edit", middleware.verifyAuthorship, (req, res) => {
  campground.findById(req.params.id, (err, selectedCampground) => {
    res.render("edit", { campground: selectedCampground });
  });
});
router.put("/:id", middleware.verifyAuthorship, (req, res) => {
  campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        console.log(`error is ${err}`);
        req.flash('error', 'Campground not found');
        res.redirect("/campgrounds");
      } else {
        req.flash('success', 'You successfully updated your campground!')
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});
router.delete("/:id", middleware.verifyAuthorship, function(req, res) {
  campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
