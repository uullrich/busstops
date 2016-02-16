var express = require('express'),
    bodyParser = require('body-parser');
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    geolib = require('geolib'),
    /* Models */
    Busnumber = require('./models/Busnumber'),
    Busstop = require('./models/Busstop'),
    Geolocation = require('./models/Geolocation');

var app = express();

app.set('port', process.env.PORT || 3000); //port
app.use(express.static(path.join(__dirname, 'public'))); //folder for static content
app.set('views', __dirname + '/views'); //folder for view
app.set('view engine', 'ejs'); //template engine
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); //for parsing JSON

//Connection string for the MongoDB
mongoose.connect('mongodb://localhost:27017/locations');

//Routes

/*
 * Route for the "All Busstops" page  
*/
app.get("/", (req, res) => {
    res.render('allBusstops', {});
});

/*
 * Returns all busstops from the database
*/
app.get("/busstop", (req, res) => {
    Busstop.find((err, busstops) => {
        if (err) {
            res.status(500).send('Error!');
        }else {
            res.json(busstops);
        }
    });
    
});

/*
 * Route for the "Busstops in range of" page
*/
app.get("/range", (req, res) => {
    res.render('inRangeBusstop', {});
});

/*
 * Returns all busstops from the passed location and the passed radius. 
 * Every busstop in range contains the distance to the passed location. 
*/
app.get("/busstop/:selectedLat/:selectedLng/:meter", (req, res) => {

    Busstop.find((err, busstops) => {
        if (err) {
            //Something went wrong with the db
            res.status(500).send('Error!');

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
                        latitude: Number(req.params.selectedLat), longitude: Number(req.params.selectedLng)
                    },
                    Number(req.params.meter) //Radius in meter
                    );
                

                if(isInRange){

                    //Calculate distance
                    var distance = geolib.getDistance(
                    {
                        latitude: Number(busstop.geolocation.lat), longitude: Number(busstop.geolocation.lng)
                    },
                    {
                        latitude: Number(req.params.selectedLat), longitude: Number(req.params.selectedLng)
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
            
            //console.log("SizeOfBusstopsInRange: " + busstopsInRange.length);

            //Check whether there are busstops in range
            if(busstopsInRange.length === 0){
                res.status(404).send("Not found");
            }else{
                res.json(busstopsInRange);
            }
        }
    });
});

/*
 * Returns details to a specific busstop.
*/
app.get("/busstop/:id", (req, res) => {
    //TODO Implement
});

/*
 * Route for the "Add Busstop" page
*/
app.get("/new", (req, res) => {
    res.render('newBusstop', {});
});

/*
 * Creates a new busstop with the location and its name in the database.
*/
app.post("/addBusstop", (req, res) => {

    //Create models for a busstop
    var geolocation = new Geolocation({
        lat: req.body.lat,
        lng: req.body.lng
    });

    var busnumber = new Busnumber({
        line: "178",
        departure: Date.now()
    });

    var busstop = new Busstop({
        name: req.body.name
    });

    busstop.geolocation = geolocation;

    busstop.busnumber.push(busnumber);

    //Save the model
    busstop.save((err, model) => {
        if (err) {
            res.status(500).send('Error!');
        }else {
            //Redirect to the "All Busstops" page
            res.redirect('/');
            console.log("Busstop created successfully with name: " + req.body.name);
        }
    });
});

//Initialize the awesome
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});