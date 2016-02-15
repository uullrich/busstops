
//Set up some of our variables.
var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker? 
        
//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap() {

    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(48.702445, 9.583351);

    //Map options.
    var options = {
      center: centerOfMap, //Set center.
      zoom: 7 //The zoom value.
    };

    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);

}

        
function markLocations(locations){
	locations.map(function(loc){
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

        //Listen for click events
	    google.maps.event.addListener(marker, 'click', function() { 
	       alert("I am marker " + marker.id); 
	    }); 
	});
}
        
//Load the map when the page has finished loading.
google.maps.event.addDomListener(window, 'load', initMap);