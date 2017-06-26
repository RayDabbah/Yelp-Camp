const express = require("express");
const router = express.Router({mergeParams: true});
campground = require('../models/campgrounds');
Comment = require('../models/comments')

router.get("/new", isLoggedIn, (req, res) => {
	campground.findById(req.params.id, (err, campground) => {
		if (err) {
			 console.log(err);
		} else {
			res.render("newcomment",
				{
					campground: campground
				});
		}
	});
});
router.post("/", isLoggedIn, (req, res) => {
	campground.findById(req.params.id, (err, campground) => {
		Comment.create(req.body.comment, (err, comment) => {
			if (err) {
				res.redirect("/campgrounds");
			} else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
                console.log(req.user)
                console.log(comment)
                console.log(campground)
				res.redirect("/campgrounds/" + campground._id);
			}
		});
	});
});
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}


module.exports = router;