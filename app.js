var express = require("express"),
	mongoose = require('mongoose'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	campground = require("./models/campgrounds"),
	Comment = require("./models/comments"),
	User = require("./models/user"),
	seed = require("./seed"),
	app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(require("express-session")({
	secret: 'These are THE best campgrounds the world has to offer!!!!!',
	resave: false,
	saveUninitialized: false,
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seed();
mongoose.connect("mongodb://localhost/yelpCampSeed");

app.use((req, res, next) => {
	res.locals.loggedIn = req.user;
	next();
});


app.get("/", (req, res) => {
	res.render("landing");
});
app.get("/campgrounds", (req, res) => {
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
app.post("/campgrounds", isLoggedIn, (req, res) => {
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
app.get("/campgrounds/new", isLoggedIn, (req, res) => res.render("newCampground"));
app.get("/campgrounds/:id", function (req, res) {
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
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
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
	campground.findById(req.params.id, (err, campground) => {
		Comment.create(req.body.comment, (err, comment) => {
			if (err) {
				res.redirect("/campgrounds");
			} else {
				campground.comments.push(comment);
				campground.save();
				res.redirect("/campgrounds/" + campground._id);
			}
		});
	});
});

// Auth Routes
app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	const newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			 console.log(err);
			return res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, () => {
				res.redirect("/campgrounds");
			});
		}
	});

});

// Login
app.get("/login", (req, res) => {
	res.render("login");
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}));

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.get("*", (req, res) => res.redirect("/"));

app.listen(3000, "localhost", () =>  console.log('The server has started.'));
//var campgrounds = [
//    {name: 'Roaring Rivers' , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCbUWZXpp1e0TpHykfTuBNPJW6xKbNhzF4DO14Kk5sUWkKtQQPAA"},
//    {name: 'Scenic Byway' , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVnLuRq6C4KcTG1qok7DRvo2dI4Gok9Cg4mkdrSjchHeNByIYCxw"},
//    {name: 'Valley Creek' , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2PvCEpVLnfwjAaHyLizRH93ds4hrF3ycEDuXAs3XlrF7JovPbsQ"},
//    {name: 'Avalanche Creek', image: 'https://www.nps.gov/glac/planyourvisit/images/avacg.jpg'},
//    {name: 'Blue Rocks Family Campground', image: 'http://bluerockscampground.com/images/rates/Tent-Camping-Blue-Rocks.jpg'},
//    {name: 'Hemlock Campgrounds', image: 'http://www.pacamping.com/img/HFltDu/900w/90/Camp_Hemlock_1_285.jpg'},
//    {name: 'Delaware Water Gap KOA', image: 'http://www.pacamping.com/img/wyvTHK/900w/90/tent.jpg'}
//];