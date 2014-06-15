var fs = require('fs');

var textToWriteToFile = "Hello World!"
var logFile = "hello.log"

fs.appendFile(logFile, textToWriteToFile + "\n", function (err) {
    if(err) {
        console.log("Error writing to file '" + logFile + "' - error is: " + err);
    }
    else {
        console.log("Successfully wrote '" + textToWriteToFile + "' to file '" + logFile + "'");
    }
});
