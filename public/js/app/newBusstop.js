define(['jquery', 'newBusstopMap', 'bootstrap', 'timepicker', 'moment'], function($, map, bootstrap, timepicker, moment){
	
    var NewBusstopUILogic = {
    	
    	busnumbers: [],
        
        selectedBusnumber: {},

        addBusstop: function name() {
            var addBusstopLogic = function () {
                var gelocation = {
                    lat: $("#lat").val(),
                    lng: $("#lng").val()
                }
                
                var busstopName = $("#busstopName").val();
                
                if(busstopName !== "" && marker !== false){
                    var busstop = {
                        name: busstopName,
                        geolocation: gelocation,
                        busnumber: NewBusstopUILogic.busnumbers 
                    };
                    
                    $.post("addBusstop", busstop).done(function(data) {
                        window.location = "/";
                    });
                }else{
                    alert("Please insert a busstopname and set a marker!");
                }
            }
            
            $("#saveBusstop").off("click").on("click", function(e){
                e.preventDefault();
                addBusstopLogic();
            });
        },

    	addBusnumber: function(){
			
            //Logic for creating a new busnumber
            var addBusnumberLogic = function(){
                
                var newBusnumber = $("#busnumberInput").val();

                if(newBusnumber === ""){
                    alert("Please insert a busnumber!");
                }else{
                    
                    $(".newBusnumberWraper").hide();
                    $("#newBusnumberButton").show();
                    
                    if(!NewBusstopUILogic.containsBusnumber(newBusnumber)){
                        $("#stepOne").show();

                        $(".busnumberList").append('<li><a href="#">' + newBusnumber + '</a></li>');
                        NewBusstopUILogic.selectBuslineInit();

                        NewBusstopUILogic.busnumbers.push({
                            line: newBusnumber,
                            departure: []
                        });

                        //Empty the input field
                        $("#busnumberInput").val("");
                    }
                }
            };

            //Eventhandlers
            $("#newBusnumberButton").off("click").on("click", function(e){
                e.preventDefault();
                $(".newBusnumberWraper").show();
                $("#newBusnumberButton").hide();
            });

			$("#addBusnumberButton").off("click").on("click", function(e){
				e.preventDefault();
                addBusnumberLogic();
			});

            $("#busnumberInput").keypress(function (ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode === 13) {
                    ev.preventDefault();
                    addBusnumberLogic();
                    return false;
                }                
            });

			$("#cancelBusnumberButton").off("click").on("click", function(e){
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
        
        selectBuslineInit: function(){
            $('.dropdown-menu li a').off( "click").on("click", function(e){
                var selected = $(this).text();
                
                NewBusstopUILogic.busnumbers.map(function(busnumber){
                    if(busnumber.line === selected){
                        NewBusstopUILogic.selectedBusnumber = busnumber;
                        $("#stepTwo").show();
                    }
                });

                $(".selectedLineLabel").html(NewBusstopUILogic.selectedBusnumber.line);

                //Clear departure times table
                $("#departureTimes tbody").html("");

                //Load times from selected busnumber into table
                NewBusstopUILogic.selectedBusnumber.departure.map(function(departureTimeInDateFormat){
                    var departureTimeInString = moment(departureTimeInDateFormat).format("h:mm a");

                    $("#departureTimes tbody").append("<tr><td>" + departureTimeInString + "</td></tr>");
                });


                //console.log("Selected" + NewBusstopUILogic.selectedBusnumber.line);
            });
        },

        isBusnumberSelected: function(){
            if(typeof selectedBusnumber.line === "undefined"){
                return false;
            }else{
                return true;
            }
        },

        addDepartureTime: function(){
            
            //Logik for a new departure Time
            var addDepartureTimeLogic = function() {
                               
                //alert("Timepicker value: " +  + " moment " + moment());
              
                var departureTimeInDateFormat = moment($(".timepicker").val(), ['h:m a', 'H:m']).toDate();                
                var departureTimeInString = moment(departureTimeInDateFormat).format("h:mm a");

                console.log(departureTimeInDateFormat);  
                console.log(departureTimeInString); 

                NewBusstopUILogic.busnumbers.map(function(busnumbers){
                    if(busnumbers.line === NewBusstopUILogic.selectedBusnumber.line){
                        
                        $("#departureTimes tbody").append("<tr><td>" + departureTimeInString + "</td></tr>");
                        busnumbers.departure.push(departureTimeInDateFormat);
                    }
                });
                
            }

            //Eventhandlers
            $(".timepicker").keypress(function (ev) {                
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode === 13) {
                    ev.preventDefault();
                    addDepartureTimeLogic();
                    return false;
                }                
            });

            $("#addTime").off("click").on("click", function(ev){
                ev.preventDefault(); 
                addDepartureTimeLogic();
                return false;
            });  
        },

        initTimepickers: function(){
            $(".timepicker").timepicker();
        },

    	init: function(){
            NewBusstopUILogic.selectBuslineInit();
			NewBusstopUILogic.addBusnumber();
            NewBusstopUILogic.addBusstop();
            NewBusstopUILogic.addDepartureTime();
            NewBusstopUILogic.initTimepickers(); 
    	}
    }

    // DOM ready
    $(function(){
        setTimeout(function(){
            initMap();
            NewBusstopUILogic.init();
        }, 1000);
    });
});