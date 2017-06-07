var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/testmongo");
var testSchema = new mongoose.Schema({
    name: String,
    age: Number,
    food: String
});

var Person = mongoose.model("Person", testSchema);
/*
var pinny = new Person({
    name: 'Pinny',
    age: 22,
    food: "Pistachios"
});
pinny.save(function(err, person) {
    if(err) {
        console.log('Something flopped.');
    } else {
        console.log('You have saved your person!');
    }
    console.log(person);
});*/
Person.find({}, function(err, people){
    if(err) {
        console.log('Oy Vey!');
    } else {
        console.log('All people: ', people);
        
    }
});