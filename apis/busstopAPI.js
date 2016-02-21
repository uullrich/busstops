var express = require('express'),
    bodyParser = require('body-parser');
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    geolib = require('geolib'),
    /* Models */
    Busnumber = require('../models/Busnumber'),
    Busstop = require('../models/Busstop'),
    Geolocation = require('../models/Geolocation');

var busstop = function (){}

/*
 * Returns all busstops from the database
*/
busstop.prototype.getBusstops = function(busstops){

    Busstop.find((error, success) => {
        if (error) {
        	//Something went wrong with the db
            console.log("DB problem");
        }else {
            busstops(success);
        }
    });

};

/*
 * Returns details to a specific busstop.
*/
busstop.prototype.getBusstopById = function(id, busstop){

    Busstop.findById(id, (error, success) => {
        if (error) {
        	//Something went wrong with the db
            console.log("DB problem");
        }else {
            busstop(success);
        }
    });

};

/*
 * Returns a busnumber of a busstop
*/
busstop.prototype.getBusnumberById = function(busstopId, busnumberId, busnumberCallback){
    
    Busstop.findById(busstopId, (error, busstop) => {
        if (error) {
        	//Something went wrong with the db
            console.log("DB problem");
        }else {
            var busnumber = null;

            //Search for busnumber with the matching id
            busstop.busnumber.map(function(busnr){
                if(busnr._id.equals(busnumberId)){
                    busnumber = busnr;
                }
            });            

            busnumberCallback(busnumber);    
        }
    });
};

/*
 * Creates a new busstop with the location and its name in the database.
*/
busstop.prototype.createBusstop = function(busstop, fail, success){
    
    var busstopModel = new Busstop(busstop);
    
    //Save the model
    busstopModel.save((error, model) => {
        if (error) {
        	fail(error);

        	//Something went wrong with the db
            console.log("DB problem");
        }else {
        	success(model);
        	
            console.log("Busstop created successfully with name: " + busstop.name);
        }
    });
};

/*
 * Returns all busstops from the passed location and the passed radius. 
 * Every busstop in range contains the distance to the passed location. 
*/
busstop.prototype.getBusstopsNearLocation = function(selectedLat, selectedLng, meter, busstopsCallback){
	
	Busstop.find((err, busstops) => {
        if (err) {
            //Something went wrong with the db
			console.log("DB problem");
        }else {
            var busstopsInRange = [];
            
            //Iterate over all busstops
            busstops.map((busstop) => {

                //Check wheter the passed location is in range of the current iterated busstop
                var isInRange = geolib.isPointInCircle(
                    {
                        latitude: Number(busstop.geolocation.lat), longitude: Number(busstop.geolocation.lng)
                    },
                    {
                        latitude: Number(selectedLat), longitude: Number(selectedLng)
                    },
                    Number(meter) //Radius in meter
                    );
                

                if(isInRange){

                    //Calculate distance
                    var distance = geolib.getDistance(
                    {
                        latitude: Number(busstop.geolocation.lat), longitude: Number(busstop.geolocation.lng)
                    },
                    {
                        latitude: Number(selectedLat), longitude: Number(selectedLng)
                    });
                    
                    //Needs to be converted due to a additional attribute (a model cant just be extended)
                    var busstopJSON = {
                        name: busstop.name,
                        geolocation: {
                            lat: busstop.geolocation.lat,
                            lng: busstop.geolocation.lng
                        },
                        busnumber: busstop.busnumber
                    }

                    busstopJSON.distance = distance;

                    //Push to busstops in range
                    busstopsInRange.push(busstopJSON);

                    console.log("In Range with distance: " + distance);
                }else{
                    console.log("Not in Range");
                }                       
            });
            
            busstopsCallback(busstopsInRange);
        }
    });
};

module.exports = new busstop;
