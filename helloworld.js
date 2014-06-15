var fs = require('fs');
var randomWords = require('random-words');

var minWords = 1;
var maxWords = 10;
var logFile = "hello.log";

// Make a 'sentence'
var textToWriteToFile = randomWords({ min: 1, max: 10, join: ' ' })

// Update the log file
WriteLineToFile(textToWriteToFile);

// Log Status
GetLinesInFile(function(numTimesRun) {
    var ess = numTimesRun == 1 ? '' : 's';
    console.log("This application has been run " + numTimesRun + " time" + ess + ".");
});


function GetLinesInFile(numLinesCallBack) {
    fs.readFile(logFile, 'utf8', function (err, data) {
      if (err) {
        return console.log("Problem getting line count in file: " + err);
      }
      // there should be a \n at the end, so subtract 1
      numLinesCallBack(data.split("\n").length - 1); 
    });
}

function WriteLineToFile(lineToWrite) {
    lineToWrite += "\n";
    fs.appendFile(logFile, lineToWrite, function (err) {
        if(err) {
            console.log("Error writing to file '" + logFile + "' - error is: " + err);
        }
        else {
            console.log("Successfully wrote '" + textToWriteToFile + "' to file '" + logFile + "'");
        }
    });   
}
