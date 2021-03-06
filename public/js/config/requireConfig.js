requirejs.config({
    baseUrl: '',

    paths: {
        jquery: './js/lib/jquery',
        bootstrap : './js/lib/bootstrap.min',
        allBusstopsMap: './js/app/allBusstopsMap',
        newBusstopMap: './js/app/newBusstopMap',
        inRangeBusstopMap: './js/app/inRangeBusstopMap',
        timepicker: './js/lib/jquery.timepicker.min',
        moment: './js/lib/moment.min'
    },

    shims: {
    	bootstrap : ['jquery']
	}
});