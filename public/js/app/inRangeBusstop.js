define(['jquery', 'inRangeBusstopMap'], function($, map){
	
    var InRangeBusstopUILogic = {
    
    	init: function(){

    	}
    }

    // DOM ready
    $(function(){	
        setTimeout(function(){
            initMap();
            InRangeBusstopUILogic.init();
        }, 1000);
    });

    return InRangeBusstopUILogic;
});