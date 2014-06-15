NodeAssignment
==============

##Assignment 1
* Create a basic node application that prints "Hello World" to a file
	* Use a file stream library (fs) to handle the file manipulation
	* Each time the application is run, have it add a new line of "Hello World" to the file
	* When the application is run, print out a statement after it has written to the file stating that that text was just written to the file.
	* Don't hard-code "Hello World" all over your program - it should only show up once in your code.
	* There should be a package.json file in your repo (remember npm init)
	* Use GitHub and commit your changes to your develop branch


##Assignment 2

* Same as assignment 1, however instead of printing "Hello World", generate a random list of words to print to the file
* Add node_modules to your .gitignore
* Print the number of times the application has been run since the last time that file was deleted/cleared


##Assignment 3
* Update your assignment 1 or 2, or create a new repository
* Use the npm library **supertest** to make network requests
	* <https://www.npmjs.org/package/supertest> 
* Read in a physical address from the command line - add a listener with tye **sys** library
	* <http://stackoverflow.com/questions/8128578/reading-value-from-console-interactively>
* Use the google maps geocoding api to convert your physical address to a gps point (note that this takes some setup/an api key from google)
	* <https://developers.google.com/maps/documentation/geocoding/>
* Connect to <http://forecast.io> and print the current weather conditions weather for that coordinate to the console
* Also append the current date and time, physical address, gps location, and current weather conditions to a file that is logging all the requested weather.
* Have error handling (tell the user something bad happened, but don't let the application crash) in case the API doesn't respond nicely.
* Bonus: Note in the log how long it took to get the coordinates and weather

##Assignment 4
* Make your assignment 3 pretty!
	* Good variable names (no single letters unless they're iterators)
	* Good looking code
		* Consistent white space between lines
		* Consistent white space after and before if/else/braces 
		* No copy & paste code - add a function if it's something you're doing regularly
