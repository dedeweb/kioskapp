# kioskapp

A android cordova application to display a web page fullscreen and modal. Device have to be rooted. Physical buttons (volume/power/...) are
not disabled. 
For example, this app is used by tamerbooth (https://github.com/dedeweb/tamerbooth) 

## Installation

	$ npm install -g cordova
	$ cd kioskapp/www/jxcore && npm install
	$ cordova run android

## Usage

The app launch a server on port 1664 to remote control the application.
webservice exposed : 
### GET server:1664/version
Used to check that the app is launched. return a Json with two properties
* app: the name of the app
* version: the version number

### POST server:1664/loadUrl
browse the url. App automatically switch to fullscreen mode.  Data should be sent using JSON in body, poperty in JSON : 
* url : the url to browse

### POST server:1664/reload
no parameters. Refresh the current page. 

### POST server:1664/exit
no parameters. Exit fullscreen mode.

### POST server:1664/fullscreen
no parameters. Go to fullscreen mode. 



## Credits

Denis Messié

## License

GPL-3.0
