
const SerialPort = require('serialport');
let openedPort = null;

SerialPort.list(function (err, ports) {
  ports.forEach((port) => {
    if(port.manufacturer && port.manufacturer.includes('arduino')){
    	console.log(port);
    	openedPort = new SerialPort(port.comName, (err) => {
			  if (err) {
			  	openedPort = null;
			    return console.log('Error: ', err.message);
			  }

			});
    }
  });
});

module.exports = {
	writeString: function(text) {
		console.log('Sending serial: ' + text);
		if(openedPort !== null){
			openedPort.write(text, function(err) {
		    if (err) {
		      return console.log('Error on write: ', err.message);
		    }
		  });
		}
	},
}