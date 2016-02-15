requirejs.config({
    baseUrl: '',

    paths: {
        jquery: './js/lib/jquery',
        bootstrap : './js/lib/bootstrap.min',
        allBusstopsMap: './js/app/allBusstopsMap',
        newBusstopMap: './js/app/newBusstopMap'
    },

    shims: {
    	bootstrap : ['jquery']
	}
});