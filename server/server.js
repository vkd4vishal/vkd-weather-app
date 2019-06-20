const express = require('express');
const geocode = require('./../weather/geocode');
const weather = require('./../weather/weather');
const time = require('./../weather/time');
const moment = require('moment');
require('../config/config');


const hbs = require('hbs');
const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + './../public'));
app.get('/views/about', (req, res) => {
  var City = req.query.City;

  var query = City;
  geocode.geocodeAddress(query, (errormessage, results) => {
    if (errormessage) {
      res.render('failed.hbs', { message: errormessage });
    }
    else {
      var date='';
      var day='';
      time.getTime(results.Latitude,results.Longitude,(errormessage,time_results)=>{
          if(errormessage){
            date='Could not get time'
          }else{
            date=time_results.formatted;
            day=moment(date).format('LL')
            date=moment(date).format('hh:mm:a');
          }
      })
        
      weather.getWeather(results.Latitude, results.Longitude, (errormessage, weather_results) => {
        if (errormessage) {
          res.render('failed.hbs', { message: errormessage });
        }
        else {

          const add = results.Address;
          const temp = Math.trunc((weather_results.temperature - 32) * (5 / 9));
          const itfeels = Math.trunc((weather_results.apparentTemperature - 32) * (5 / 9));
          const summary = weather_results.summary;
          const windSpeed = weather_results.windSpeed;
          const temperatureMin = Math.trunc((weather_results.temperatureMin - 32) * (5 / 9));
          const temperatureMax = Math.trunc((weather_results.temperatureMax - 32) * (5 / 9)); 
          const hourly_summary = weather_results.hourly_summary;
         
          var hur = '';
          var hback = '';
          var home='';
          var about='';
          if (port == 3000) {
            hback = '"http://localhost:3000/images/index.jpg"';
            home='"http://localhost:3000/index.html"';
            about='"http://localhost:3000/about.html"';
            if (summary.match(/Cloud/))
              hur = '"http://localhost:3000/images/cloudy.gif"';
            else if (summary.match(/Clear/g))
              hur = '"http://localhost:3000/images/clear.jpg"';
            else if (summary.match(/Rain/))
              hur = '"http://localhost:3000/images/rainy.gif"';
            else if (summary.match(/Fog/))
              hur = '"http://localhost:3000/images/foggy.gif"';
            else
              hur = '"http://localhost:3000/images/clear.jpg"';
          }
          else {
            hback = '"http://vkd-weather-app.herokuapp.com/images/index.jpg"';
            home='"http://vkd-weather-app.herokuapp.com/index.html"';
            about='"http://vkd-weather-app.herokuapp.com/about.html"';
            if (summary.match(/Cloud/))
              hur = '"http://vkd-weather-app.herokuapp.com/images/cloudy.gif"';
            else if (summary.match(/Clear/g))
              hur = '"http://vkd-weather-app.herokuapp.com/images/clear.jpg"';

            else if (summary.match(/Rain/))
              hur = '"http://vkd-weather-app.herokuapp.com/images/rainy.gif"';

            else if (summary.match(/Fog/))
              hur = '"http://vkd-weather-app.herokuapp.com/images/foggy.gif"';
            else
              hur = '"http://vkd-weather-app.herokuapp.com/images/clear.jpg"';
          }

         
          
          var more = `"http://darksky.net/forecast/${results.Latitude},${results.Longitude}/us12/en"`;
          var tile = `"https://image.maps.api.here.com/mia/1.6/mapview?app_id=${process.env.appid}&app_code=${process.env.appcode}&c=${results.Latitude},${results.Longitude}&u=7k&h=400&w=600"`;
          res.render('about.hbs', { add, temp, itfeels,day, summary,about,home, hur, hback, more, tile,query,windSpeed,temperatureMax,temperatureMin,hourly_summary,date });


        }
      });

    }
  });

});

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
