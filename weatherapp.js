var fs = require('fs');
var sys = require('sys');
var newRequest = require('supertest'); 


// TODO: Put all this in a json config file!
var logFile = "weatherrequest.log";
var googleAPIBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";
var googleAPIKey = "AIzaSyAetPrzgN50CQc2QYGctcskeun5R07KlJM";
var googleRequiredParams = "sensor=false";
var forecastIOApiUrl = "https://api.forecast.io/";
var forecastIOApiPath = "forecast/";
var forecastIOApiKey = "98fafca6511d046f46c53ccb458fefd4";

// TODO: Handle API changes

// Wait for input from the console for an address - prompt the user
UserPrompt();
var stdin = process.openStdin();

stdin.addListener("data", function(enteredAddy) {
  // Remove the last line feed so we don't sent it to the google api
  var addressForGoogle = enteredAddy.toString().substring(0, enteredAddy.length-1);

  MakeGoogleRequest(addressForGoogle, function(err, lat, lng, formattedAddy) {
    if(err) {
      console.log("Error in google request: " + err);
      UserPrompt();
    } 
    else {
      MakeForecastIORequest(lat, lng, function(err, forecastJson) {
        if(err) {
          console.log("Error in forecast io request: " + err);
        }
        else {
          var lineToLog = ParseForecastIOResponseJson(formattedAddy, forecastJson); 
          console.log("<<<YOUR CURRENT WEATHER FORECAST>>>")
          console.log(JSON.stringify(lineToLog, null, 4));
          console.log("<<<----------------------------->>>")

          WriteLineToFile(JSON.stringify(lineToLog, null, 4));
        
          UserPrompt();
        }
      }); 
    }
  });
});
 
function UserPrompt() {
  console.log("Enter an address on one line to get the weather!");
}

function ParseForecastIOResponseJson(address, forecastJson) {
  return {
    date: new Date(),
    address: address,
    lat: forecastJson.latitude,
    lng: forecastJson.longitude,
    currentWeatherSummary: forecastJson.currently.summary,
    currentTemperature: forecastJson.currently.temperature,
    currentWindSpeed: forecastJson.currently.windSpeed,
    currentHumidity: forecastJson.currently.humidity
  };
}

function MakeGoogleRequest(unencodedAddress, done) {
  newRequest(BuildGoogleGeocodeUrl(unencodedAddress))
    .get(forecastIOApiPath)
    .send()
    .expect(200)
    .end(function(err, res) {
      if(err) {
        done("Error accessing Google's Geocode API: " + err);
      }
      else {
        if(res.body.status != "OK") {
          done("Google Request Not OK: ", JSON.stringify(res.body));
        }
        else {
          var lat = res.body.results[0].geometry.location.lat;
          var lng = res.body.results[0].geometry.location.lng;
          var prettyaddy = res.body.results[0].formatted_address;
          done(null, lat, lng, prettyaddy);
        }
      }
    }); // End request response handling
}

function MakeForecastIORequest(lat, lng, done) {
  var path = forecastIOApiPath + forecastIOApiKey + "/" + lat + "," + lng;
  newRequest(forecastIOApiUrl)
    .get(path)
    .send()
    .expect(200)
    .end(function(err, res) {
      if(err) {
        done("Error accessing ForecastIO weather API: " + err + 
          ". Server response is: " + JSON.stringify(res.body));
      }
      else {
        done(null, res.body);
      }
    });
}

function BuildGoogleGeocodeUrl(unencodedAddress) {
  var encodedAddressForGoogle = encodeURIComponent(unencodedAddress);

  return googleAPIBaseUrl + 
     "address=" + encodedAddressForGoogle + 
     "&" + googleRequiredParams + 
     "key=" + googleAPIKey;
}

function WriteLineToFile(lineToWrite) {
    lineToWrite += "\n";
    fs.appendFile(logFile, lineToWrite, function (err) {
        if(err) {
            console.log("Error writing to file '" + logFile + "' - error is: " + err);
        }
        else {
            //console.log("Successfully wrote weather conditions to file '" + logFile + "'");
        }
    });   
}
