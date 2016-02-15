//Load the config, then load the app logic for this page.
requirejs(['./requireConfig'], function (requireConfig) {
    requirejs(['./js/app/newBusstop']);
});