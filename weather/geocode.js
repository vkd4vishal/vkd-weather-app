const request = require('request');
require('../config/config');

var geocodeAddress = (address,callback) => {
   // var encodedAddress = encodeURIComponent(address);
    request({
        url: `https://us1.locationiq.com/v1/search.php?key=${process.env.lockey}&q=${address};&format=json`,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Server Error:Make sure you are connected to internet...');
        }
        else if (body.error) {
            callback('Unable to find this location...Please try another location...');
        }
        else {
              var results = {
                Address: body[0].display_name,
                Latitude: body[0].lat,
                Longitude: body[0].lon

              }
            callback(undefined,results);
        }
    });
};

module.exports = {
    geocodeAddress
};