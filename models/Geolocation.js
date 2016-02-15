var mongoose = require('mongoose');


// Create a database schema for a geolocation object
var geolocationSchema = mongoose.Schema({
    lat:String,
    lng:String
});

// Create a model object constructor that will have ODM functionality like .save()...
var Geolocation = mongoose.model('Geolocation', geolocationSchema);

module.exports = Geolocation;