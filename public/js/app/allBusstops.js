define(['jquery', 'allBusstopsMap', 'moment'], function($, map, moment){
	
    var AllBusstopsUILogic = {
    	
    	renderMarker: function(data){
            markLocations(data);
    	},

    	fetchAllBusstops: function(){
			var jqxhr = $.get("/busstop").done(function(data) {
				AllBusstopsUILogic.renderMarker(data);
			}).fail(function() {
				console.log("Webservice problem!");
				$("#status").html("Webservice problem!");
			});
    	},

    	init: function(){
			AllBusstopsUILogic.fetchAllBusstops();
    	}
    }

    // DOM ready
    $(function(){
    	AllBusstopsUILogic.init();
    });

    return AllBusstopsUILogic;
});