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

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/locations');

//Routes

app.get("/test", (req, res) => {
	//res.render('test', {});

    var geolocation = new Geolocation({
        lat: "4711",
        lng: "42"
    });

    var busschedule = new Busschedule({
        line: "178",
        departure: Date.now()
    });

    var busstop = new Busstop({
        name: "Eselsberg"
    });

    busstop.geolocation = geolocation;

    busstop.busschedules.push(busschedule);

    //Save the model
    busstop.save((err, model) => {
        if (err) {
            res.send(500, 'Error!');
        }else {
            //res.redirect('/');
            res.status(200).send("OK!");
            console.log("Success");
        }
    });
});

app.get("/", (req, res) => {
    res.render('allBusstops', {});
});

app.get("/busstop", (req, res) => {
    Busstop.find((err, busstops) => {
        if (err) {
            res.send(500, 'Error!');
        }else {
            res.json(busstops);
        }
    });
    
});

app.get("/range", (req, res) => {
    res.render('inRangeBusstop', {});
});

app.get("/busstop/:selectedLat/:selectedLng/:meter", (req, res) => {
/*  
    // checks if 51.525, 7.4575 is within a radius of 5km from 51.5175, 7.4678
geolib.isPointInCircle(
	{latitude: 51.525, longitude: 7.4575},
	{latitude: 51.5175, longitude: 7.4678},
	5000
);
*/
    Busstop.find((err, busstops) => {
        if (err) {
            res.send(500, 'Error!');
        }else {
            var busstopsInRange = [];
            
            busstops.map((busstop) => {
                var isInRange = geolib.isPointInCircle(
                {
                    latitude: busstop.geolocation.lat, longitude: busstop.geolocation.lng
                },
                {
                    latitude: req.params.selectedLat, longitude: req.params.selectedLng
                },
                Number(req.params.meter) //Radius in meter
                );
                
                if(isInRange){
                    busstopsInRange.push(busstop);
                    console.log("Not in Range")
                }else{
                    console.log("In Range")
                }                       
            });
            
            console.log("SizeOfBusstopsInRange: " + busstopsInRange.length);
            if(busstopsInRange.length === 0){
                res.status(404).status("Not found");
            }else{
                res.json(busstopsInRange);
            }
        }
    });
});

app.get("/busstop/:id", (req, res) => {
    //TODO Implement
});

app.get("/new", (req, res) => {
    res.render('newBusstop', {});
});

app.post("/addBusstop", (req, res) => {

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
            res.send(500, 'Error!');
        }else {
            res.redirect('/');
            console.log("Busstop created successful with name: " + req.body.name);
        }
    });
});

//Initialize the awesome
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});