const express = require("express");
const router = express.Router({ mergeParams: true });
campground = require("../models/campgrounds");
Comment = require("../models/comments");
const middleware = require('../middleware');
router.get("/new", middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("newcomment", {
        campground: campground
      });
    }
  });
});
router.post("/", middleware.isLoggedIn, (req, res) => {
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
        res.redirect("/campgrounds/" + campground._id);
      }
    });
  });
});

router.get("/:commentId/edit", middleware.verifyCommentAuthor, (req, res) => {
  Comment.findById(req.params.commentId, (err, foundComment) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("editComment", {
        campground: req.params.id,
        comment: foundComment
      });
    }
  });
});

router.put("/:commentId", middleware.verifyCommentAuthor, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

router.delete("/:commentId", middleware.verifyCommentAuthor, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId, err => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  });
});


module.exports = router;
