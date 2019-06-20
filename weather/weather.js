const request = require('request');
require('../config/config');

var getWeather = (lat, lon, callback) => {
  request({
        url:`https://api.darksky.net/forecast/${process.env.weathkey}/${lat},${lon}`,  
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to the server forecast.io. Make sure your are connected to the internet');
        }
        else if (body.code === 400) {
            callback('Location not found');
        }
        else {
            
            callback(undefined, {
               temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature,
                summary: body.currently.summary,
                windSpeed: body.currently.windSpeed,
                temperatureMax: body.daily.data[0].temperatureMax,
                temperatureMin: body.daily.data[0].temperatureMin,
                hourly_summary: body.hourly.summary,
                time: body.currently.time
            });
        }
    }
    );
};
module.exports.getWeather = getWeather;