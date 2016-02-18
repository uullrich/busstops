var mongoose = require('mongoose');


// Create a database schema for a busnumber object
var busnumberSchema = mongoose.Schema({
    line: String,
    departure: [Date]
});

// Create a model object constructor that will have ODM functionality like .save()...
var Busnumber = mongoose.model('Busnumber', busnumberSchema);

module.exports = Busnumber;