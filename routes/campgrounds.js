const express = require('express');
const router = express.Router();
const campground = require('../models/campgrounds');

router.get("/", (req, res) => {
	campground.find({}, function (err, allCampgrounds) {
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
	var newCampGround = {
		name: name,
		image: image,
		description: desc
	};
	campground.create(newCampGround, function (err, latestCampground) {
		if (err) {
			res.redirect("/campgrounds/new");
			 console.log('There was en error adding your campground.');
		} else {
			res.redirect("/campgrounds");
		}
	});
});
router.get("/new", isLoggedIn, (req, res) => res.render("newCampground"));
router.get("/:id", function (req, res) {
	campground.findById(req.params.id).populate("comments").exec(function (err, clickedOnCg) {
		if (err) {
			 console.log(err);
		} else {
			res.render("show", {
				campground: clickedOnCg
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}


module.exports = router;