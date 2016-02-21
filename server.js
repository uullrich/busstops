var express = require('express'),
    bodyParser = require('body-parser');
    http = require('http'),
    path = require('path'),
    busstopApi = require('./apis/busstopAPI');

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

    busstopApi.getBusstops((busstops) => {
        res.json(busstops);
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
    
    var selectedLat = req.params.selectedLat;
    var selectedLng = req.params.selectedLng;
    var meter = req.params.meter;

    busstopApi.getBusstopsNearLocation(selectedLat, selectedLng, meter, (busstopsInRange) => {
        //Check whether there are busstops in range
        if(busstopsInRange.length === 0){
            res.status(404).send("Not found");
        }else{
            res.json(busstopsInRange);
        }
    });
});

/*
 * Returns details to a specific busstop.
*/
app.get("/busstop/:id", (req, res) => {

    busstopApi.getBusstopById(req.params.id, (busstop) => {
        res.status(200).json(busstop);
    });

});

/*
 * Returns a busnumber of a busstop
*/
app.get("/busstop/:busstopid/:busnumberid", (req, res) => {

    var busstopId = req.params.busstopid;
    var busnumberId = req.params.busnumberid;

    busstopApi.getBusnumberById(busstopId, busnumberId, (busnumber) => {
        if(busnumber === null){
           res.status(404).send("Not found!"); 
        }else{
            res.status(200).json(busnumber);
        } 
    });
});

/*
 * Deletes a busstop with the passed id.
*/
app.delete("busstop/:id", (req, res) => {

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

    var busstopJSON = req.body;

    busstopApi.createBusstop(busstopJSON, (error) => {
        res.status(500).send('Error!');
    }, (success) => {
        res.status(200).send('Success!');
    });
});

//Initialize the awesome
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});