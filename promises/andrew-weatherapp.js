var fs = require("fs"),
    readline = require("readline"),
    request = require("supertest"),
    // For chaining
    Q = require("q"),
    dateformat = require("dateformat"),
    // Configuration file is not tracked by repo
    // see sample.config.json for format
    config = require("./config.json");

initiateRequest();

/**
 * Request address from user to retrieve results.  This is called in an
 * asynchronous loop until the user does not provide an address
 */
function initiateRequest() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Please select your character! (or enter your address): ", function (address) {
        rl.close();

        // Allow user to exit when they don't provide an address
        if (!address) {
            console.log("No address provided.  Exiting...");
        }
        else {
            // Initiate the promise chain; if a request fails or an exception
            // is thrown, print the error and exit with non-zero status
            getGeoCoordinates(address)
                .then(getForecast)
                .then(handleResults)
                // Retrieve information for another address
                .then(initiateRequest)
                .fail(function (failure) {
                    console.error("Failed with error: ", failure);
                    console.error("Exiting...");
                    process.exit(1);
                });
        }
    });
}

/**
 * Retrieve geolocation information from user-provided address
 * @param String
 * @return Promise
 */
function getGeoCoordinates(address) {
    var dfd = Q.defer(),
        flag = Math.random();

    // Record time of geocode request
    console.time(flag + "geo");

    request("https://maps.googleapis.com/maps/api/geocode/json")
        .get("?address=" + encodeURIComponent(address) + "&key=" + config["google-api-key"])
        .expect(200)
        .end(function (err, res) {
            if (err) {
                dfd.reject("Geocode error: " + err);
            }
            else {
                console.log("Geo request completed (time):");
                console.timeEnd(flag + "geo");
                console.log();

                // Resolve with array of address results
                dfd.resolve(res.body.results);
            }
        });

    return dfd.promise;
}

/**
 * Retrieve forecast information from coordinates derived from Geocode address
 * information
 *
 * @param Array
 * @return Promise
 */
function getForecast(address) {
    var geo,
        flag = Math.random(),
        dfd = Q.defer();

    // Record time of forecast.io request
    console.time(flag + "forecast");

    if (address.length > 1) {
        console.log("Multiple results for address.  Using the first...");
    }
    // address is always an array even if results have one element
    address = address[0];
    // Get lat,lng for use by forecast.io
    geo = address.geometry.location;

    request("https://api.forecast.io/forecast")
        .get("/" + config["forecast-io-key"] + "/" + geo.lat + "," + geo.lng)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                dfd.reject("Forecast error: " + err);
            }
            else {
                console.log("Forecast request completed (time):");
                console.timeEnd(flag + "forecast");
                console.log();

                dfd.resolve({
                    // Current weather conditions
                    weather: res.body.currently,
                    address: address,
                });
            }
        });

    return dfd.promise;
}

/**
 * Display/log results of Forecast/Geocoding
 * @param Object with weather,address keys
 * @return Promise for chaining
 */
function handleResults(data) {
    var weatherDisplay,
        dfd = Q.defer(),
        forecast = data.weather,
        address = data.address,
        gps = address.geometry.location,
        // Append information to log file
        logFile = fs.createWriteStream(config["log-file"], {flags: "a"}),
        // Log datetime based on forecast.io results rather than system time
        date = new Date(Date(forecast.time));

    logFile.write((new Array(50).join("=")) + "\n");
    logFile.write("Weather for " + dateformat(date, "yyyy-mm-dd HH:MM\n"));
    logFile.write(" -- " + address.formatted_address + " ("
        + gps.lat + ", " + gps.lng + ")\n");

    weatherDisplay = "Current weather: " + forecast.summary + "\n"
        + "    Temperature: " + forecast.temperature + "\n"
        + "    Humidity: " + forecast.humidity + "\n\n";

    logFile.write(weatherDisplay);
    logFile.end();

    console.log(weatherDisplay);

    // Promise is never rejected; exception may be thrown above and handled
    // by Q automagically
    dfd.resolve();
    return dfd.promise;
}
