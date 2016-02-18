
//Set up some of our variables.
var map; //Will contain map object.
var marker = false; //Marker already placed in the map?
var busstations = []; //All busstations in range

//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap() {

    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(48.702445, 9.583351);

    //Map options.
    var options = {
      center: centerOfMap, //Set center.
      zoom: 10 //The zoom value.
    };

    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {                
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        //If the marker hasn't been added.
        if(marker === false){
            //Create the marker.
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true //make it draggable
            });

            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')

            //Listen for drag events!
            google.maps.event.addListener(marker, 'dragend', function(event){
                markLocationsInRange();
            });
        } else{
            //Marker has already been added, so just change its location.
            marker.setPosition(clickedLocation);
        }
        //Get the marker's location.
        markLocationsInRange();
    });

}
      
function markLocationsInRange(){
    var selectedLocation = marker.getPosition();
    var selectedLat = selectedLocation.lat();
    var selectedLng = selectedLocation.lng();
    var radius = Number($("#radius").val());

    $('#request').html("Last request: " + '/busstop/' + selectedLat + '/' + selectedLng + '/' + radius);

    var jqxhr = $.get('/busstop/' + selectedLat + '/' + selectedLng + '/' + radius).done(function(locations) {
        
        removeAllMarkers();
        removeAllBusstopsFromTable();
        
        $("#status").html("");

        locations.map(function(loc){
            
            addBusstopToTable(loc.name, loc.distance);

            var latLngRaw = loc.geolocation;
            
            //Do casting for the google api - needs to be in number
            var latLng = {
                lat: Number(latLngRaw.lat), 
                lng: Number(latLngRaw.lng)
            }

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: loc.name,
                id: loc._id
            });

            busstations.push(marker);

            //Listen for click events
            google.maps.event.addListener(marker, 'click', function() { 
                alert("I am marker " + marker.id); 
            }); 
	   });
       
    }).fail(function(error) {
        
        removeAllMarkers();
        removeAllBusstopsFromTable();

        if(error.status === 404){
            $("#status").html("No busstop in range");
        }else{
            console.log("Webservice problem!");
            $("#status").html("Webservice problem: " + error.status);
        }
    });
}
       
function removeAllMarkers(){
    busstations.map(function(marker){
       marker.setMap(null); 
    });
    
    busstations = [];

}  

function removeAllBusstopsFromTable(){
    $("#addbusstop > tbody").html("");
}

function addBusstopToTable(name, distance){
    $("#addbusstop > tbody").append('<tr><td>' + name + '</td><td>' + distance + '</td></tr>');
}
        
//Load the map when the page has finished loading.
google.maps.event.addDomListener(window, 'load', initMap);