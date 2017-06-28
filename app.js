var express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  campground = require("./models/campgrounds"),
  Comment = require("./models/comments"),
  User = require("./models/user"),
  seed = require("./seed"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  app = express();
var bodyParser = require("body-parser");
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");
app.use(methodOverride("_method"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  require("express-session")({
    secret: "These are THE best campgrounds the world has to offer!!!!!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seed();
mongoose.connect("mongodb://localhost/yelpCampSeed");

app.use((req, res, next) => {
  res.locals.loggedIn = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, "localhost", () => console.log("The server has started."));
