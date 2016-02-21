var expect  = require("chai").expect;
var request = require("request");

var host = "http://localhost:3000";

describe("Create and Fetch a busstop", function() {

/*
it("Test", function(){
    expect({ foo: { bar: { baz: 'quux' } } }).to.have.deep.property('foo.bar.baz', 'quux');
});
*/

	var payload = {
        name: 'Testbusstop',
        geolocation: {
        	lat: "48.70183766127343",
        	lng: "9.633636474609375"
        },
        busnumber: [{
        	line: "Line 1",
        	departure: [Date.now()]
        }]
    };

  describe("Create a new busstop", function() {

    it("returns status 200", function() {
		request({
		    url: host + '/addBusstop',
		    method: 'POST',
		    json: payload
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
		        expect(response.statusCode).to.equal(200);
		}
		});
    });
    
  });

  describe("Get all busstops", function() {

    var url = host + "/busstop";

    it("returns status 200", function() {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

    it("returns the previous generated busstop", function() {
      request(url, function(error, response, body) {
        //expect(body).to.deep.equal(payload);
        expect(body[0]).to.have.deep.property('name', 'Testbusstop');
      });
    });

  });

});