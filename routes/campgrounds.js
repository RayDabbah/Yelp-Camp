const express = require("express");
const router = express.Router();
const campground = require("../models/campgrounds");
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
router.post("/", isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var user = req.user.username;
  var userId = req.user._id;
  console.log(req.user);
  var newCampGround = {
    name: name,
    image: image,
    description: desc,
    author: {
      username: user,
      id: userId
    }
  };
  campground.create(newCampGround, function(err, latestCampground) {
    if (err) {
      res.redirect("/campgrounds/new");
      console.log("There was en error adding your campground.");
    } else {
      res.redirect("/campgrounds");
    }
  });
});
router.get("/new", isLoggedIn, (req, res) => res.render("newCampground"));
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
router.get("/:id/edit", verifyAuthorship, (req, res) => {
  campground.findById(req.params.id, (err, selectedCampground) => {
    res.render("edit", { campground: selectedCampground });
  });
});
router.put("/:id", isLoggedIn, (req, res) => {
  campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        console.log(`error is ${err}`);
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});
router.delete("/:id", verifyAuthorship, function(req, res) {
  campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function verifyAuthorship(req, res, next) {
  if (req.isAuthenticated()) {
    campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCampground.author.id.toString() == req.user._id) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
