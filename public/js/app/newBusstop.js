define(['jquery', 'newBusstopMap', 'bootstrap', 'timepicker', 'moment'], function($, map, bootstrap, timepicker, moment){
	var NewBusstopUILogic = {
    	
    	busnumbers: [],
        
        selectedBusnumber: {},

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
        
        addDepartureTime: function(){
            $("#addTime").click(function(e) {
                e.preventDefault();                
                //alert("Timepicker value: " +  + " moment " + moment());
              
                var departureTimeInDateFormat = moment($(".timepicker").val(), ['h:m a', 'H:m']).toDate();
                console.log(departureTimeInDateFormat);  
                             
                NewBusstopUILogic.busnumbers.map(function(busnumbers){
                    if(busnumbers.line === NewBusstopUILogic.selectedBusnumber.line){
                        busnumbers.departure.push(departureTimeInDateFormat);
                    }
                });
                
                NewBusstopUILogic.appendNewDeparterTime();
                return false;
            })  
        },
        
        appendNewDeparterTime: function(){
              
        },
        
        initTimepickers: function(){
            $(".timepicker").timepicker();
        },

    	init: function(){
			NewBusstopUILogic.addBusnumber();
            NewBusstopUILogic.addDepartureTime();
            NewBusstopUILogic.initTimepickers();
    	}
    }

    // DOM ready
    $(function(){
    	NewBusstopUILogic.init();
    });
});