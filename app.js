var express = require("express"),
	mongoose = require('mongoose'),
	campground= require("./models/campgrounds"),
	seed = require("./seed"),
	app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelpCampSeed");


app.get("/", (req, res) => {
	res.render("landing");
});
app.get("/campgrounds", (req, res) => {
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
app.post("/campgrounds", (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampGround = {
		name: name,
		image: image,
		description: desc
	};
	campground.create(newCampGround, function(err, latestCampground) {
		if (err) {
			res.redirect("/campgrounds/new");
			console.log('There was en error adding your favorite campground.');
		} else {
			res.redirect("/campgrounds");
		}
	});
});
app.get("/campgrounds/new", (req, res) => res.render("newCampground"));
app.get("/campgrounds/:id", function(req, res) {
	campground.findById(req.params.id, function(err, clickedOnCg) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {
				campground: clickedOnCg
			});

		}
	});
});
app.get("*", (req, res) => res.redirect("/"));

app.listen(3000,"localhost", () => console.log('The server has started.'));
//var campgrounds = [
//    {name: 'Roaring Rivers' , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCbUWZXpp1e0TpHykfTuBNPJW6xKbNhzF4DO14Kk5sUWkKtQQPAA"},
//    {name: 'Scenic Byway' , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVnLuRq6C4KcTG1qok7DRvo2dI4Gok9Cg4mkdrSjchHeNByIYCxw"},
//    {name: 'Valley Creek' , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2PvCEpVLnfwjAaHyLizRH93ds4hrF3ycEDuXAs3XlrF7JovPbsQ"},
//    {name: 'Avalanche Creek', image: 'https://www.nps.gov/glac/planyourvisit/images/avacg.jpg'},
//    {name: 'Blue Rocks Family Campground', image: 'http://bluerockscampground.com/images/rates/Tent-Camping-Blue-Rocks.jpg'},
//    {name: 'Hemlock Campgrounds', image: 'http://www.pacamping.com/img/HFltDu/900w/90/Camp_Hemlock_1_285.jpg'},
//    {name: 'Delaware Water Gap KOA', image: 'http://www.pacamping.com/img/wyvTHK/900w/90/tent.jpg'}
//];
