const request = require('request');
require('../config/config');

var getTime = (lat, lon, callback) => {
  request({
        url:`http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.timekey}&format=json&by=position&lat=${lat}&lng=${lon}`,  
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to the server . Make sure your are connected to the internet');
        }
        else if (body.code === 400) {
            callback('Location not found');
        }
        else {
            
            callback(undefined, {
              formatted: body.formatted
            });
        }
    }
    );
};
module.exports.getTime = getTime;