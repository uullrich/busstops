
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
      zoom: 10 //The zoom value.
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
			id: loc._id,
			icon: "../img/busstop32.png"
		});

        //Listen for click events
	    google.maps.event.addListener(marker, 'click', function() { 
	       //alert("I am marker " + marker.id); 
			fetchBusstopById(marker.id);
	    }); 
	});
}

function fetchBusstopById(id){
	var jqxhr = $.get("/busstop/" + id).done(function(busstop) {
		
		//Clear lists of Busnumbers
		$("#busnumbers tbody").html("");

		//Insert all busnumbers of a station
		busstop.busnumber.map(function(busnumber){
			$("#busnumbers tbody").append('<tr><td><div class="busnumberSelector" rel="' + busnumber._id + '">' + busnumber.line + '</div></td></tr>');
			$(".busnumberSelector").css("cursor", "pointer");
		});

		//Set selected busstopname
		$("#busstopname").html(busstop.name);
		$("#busstopname").attr('rel', busstop._id);
		
		//Clear departure times table and reset selected busnumber
		$("#departureTimes tbody").html("");
		$("#bussnumber").html("(select a busnumber)");
		
		selectBusnumberInit();
	}).fail(function() {
		console.log("Webservice problem!");
		$("#status").html("Webservice problem!");
	});
}

function selectBusnumberInit(){

    var selectBusnumberLogic = function(busnumber, busnumberid){        
    	$("#bussnumber").html(busnumber);

        var jqxhr = $.get("/busstop/" + $("#busstopname").attr("rel") + "/" + busnumberid).done(function(busnumber) {

			$("#departureTimes tbody").html("");

            //Set all departure times from the selected bussnumber into the table
            busnumber.departure.map(function(departureTimeInDateFormat){
            	var departureTimeInString = moment(departureTimeInDateFormat).format("h:mm a");
            	
            	$("#departureTimes tbody").append("<tr><td>" + departureTimeInString + "</td></tr>");
            });

        }).fail(function() {
            console.log("Webservice problem!");
            $("#status").html("Webservice problem!");
        });

    };

    $(".busnumberSelector").off("click").on("click", function(e){
        e.preventDefault();
        selectBusnumberLogic($(this).html(), $(this).attr("rel"));
    });
    
}
        
//Load the map when the page has finished loading.
google.maps.event.addDomListener(window, 'load', initMap);