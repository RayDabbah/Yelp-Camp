var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");
var data = [{
	name: "Dingy Doggie Barkgrounds",
	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMQn6-KMmBe7NilIp1qIvUW6Qx69dyL8aQALel8V2Fo-Y9ZpQqPw",
	description: "If you're a dog lover; whether you like poodles or pitbulls; german sheperds or chouauas, you will bask in the glory of bonding with nature with man's best friend. Showers and bathroom for you and your four legged friends too! This a dog friendly nature experince you surely will cherish for many years to come!!!"
}, {
	name: "The most gorgeos campground in the entire world that you can imagine anytime!",
	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg47fiHdXka7QJimVfsjT2Zkmg9Gnoniooesa-zIPzfr1XdX2t",
	"description": "A nature lover's paradise! This is a Scenic opportunity second to none!"
}, {
	name: "Gregory Hills",
	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmg4d3aTKk-keGkl2sLYljFdB88nOMuf-v9KvfJHGjfGh45TuF",
	description: "One of a kind primitive campground. \r\nNeed to see it to believe it!"
}, {
	name: "Relax Max",
	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9BWBNgqViuWEmqjcyrkOdtpYRWsZyCy84y_BbI62AAk0QDez9rQ",
	description: "There's nothing so relaxing as a snow covered camping trip!\r\nCoupled with the gorgeous scenery and backcountry adventure it's something you don't want to miss!!!!!!!!!!!!!!!!!"

}];

function seedDB() {
	Campground.remove({}, function (err) {
		if (err) {
			console.log(err);
		}
		console.log("Cleared database");
		data.forEach(function (grounds) {
			Campground.create(grounds, function (err, campG) {
				if (err) {
					console.log(err);
				} else {
					console.log(`created ${campG.name}`);
					Comment.remove({}, err => {
						if (err) {
							console.log(err);
						}
						Comment.create({
							text: `The only campground I've been to that serves herring!!!`,
							author: `Moshe Kapoach`
						}, function (err, comm) {
							if (err) {
								console.log(err);
							} else {
								campG.comments.push(comm);
								campG.save();
								console.log(`${comm.author}Added comment to ${campG.name}`);
							}
						});
					});
				}
			});
		});

	});
}

module.exports = seedDB;