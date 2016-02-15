/* DEPRECATED
define(['jquery', 'map'], function($, map){

    var NewBusstopUILogic = {
    	
    	busnumbers: [],

    	addBusnumber: function(){
			$("#newBusnumberButton").click(function(e){
				e.preventDefault();
				$(".newBusnumberWraper").show();
				$("#newBusnumberButton").hide();
			});
			
			$("#addBusnumberButton").click(function(e){
				e.preventDefault();

				var newBusnumber = $("#busnumberInput").val();

				if(newBusnumber === ""){
					alert("Please insert a busnumber!");

				}else{
					
					$(".newBusnumberWraper").hide();
					$("#newBusnumberButton").show();
					
					if(!NewBusstopUILogic.containsBusnumber(newBusnumber)){
						$(".busnumberList").append('<li><a href="#">' + newBusnumber + '</a></li>');

						NewBusstopUILogic.busnumbers.push({
							line: newBusnumber,
							departure: []
						});

						//Empty the input field
						$("#busnumberInput").val("");
					}
				}
			});

			$("#cancelBusnumberButton").click(function(e){
				e.preventDefault();
				$(".newBusnumberWraper").hide();
				$("#newBusnumberButton").show();

				//Empty the input field
				$("#busnumberInput").val("");
			});
    	},

    	containsBusnumber: function(busnumber){
    		for(var i = 0; i < NewBusstopUILogic.busnumbers.length; i++){
    			if(busnumber === NewBusstopUILogic.busnumbers[i].line){
    				return true;
    			}
    		}

    		return false;
    	},

    	init: function(){
			NewBusstopUILogic.addBusnumber();
    	}
    };

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
    	NewBusstopUILogic.init();
    	AllBusstopsUILogic.init();
    });
});

*/