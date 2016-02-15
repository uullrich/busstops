var mongoose = require('mongoose'),
	geolocation = require('./Geolocation'),
	busnumber = require('./Busnumber');

var Busnumber = new busnumber().schema;
var Geolocation = new geolocation().schema;

// Create a database schema for a busstop object
var busstopSchema = mongoose.Schema({
    name: String,
    geolocation: Geolocation,
    busnumber: [Busnumber]
});

// Create a model object constructor that will have ODM functionality like .save()...
var Busstop = mongoose.model('Busstop', busstopSchema);

module.exports = Busstop;