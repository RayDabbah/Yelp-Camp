
var middlewareObj = {};
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be signed in to do that.")
  res.redirect("/login");
},
  middlewareObj.verifyAuthorship = function (req, res, next) {
    if (req.isAuthenticated()) {
      campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
          res.redirect("back");
        } else {
          if (foundCampground.author.id.toString() == req.user._id) {
            next();
          } else {
            req.flash("error", "You need to be the owner of that campground to do that.")
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be signed in to do that.")
      res.redirect("/login");
    }
  },
  middlewareObj.verifyCommentAuthor = function (req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.commentId, (err, editComment) => {
        if (err) {
          res.redirect("back");
        } else {
          if (editComment.author.id.toString() == req.user._id) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be the writer of that comment to do that!")
      res.redirect("/login");
    }
  },

  module.exports = middlewareObj;
