import app from './app';
import settingsService from './services/settingsService';

var SerialPort = require('serialport');
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);

const port = process.env.PORT || '3000';
server.listen(port);
console.log(`Listening on port ${port}`);

if (settingsService.settings.nfcReaderSerialPort){
    var serialPort = new SerialPort(settingsService.settings.nfcReaderSerialPort, {
        baudRate: settingsService.settings.nfcReaderBaudRate
    });
    
    serialPort.on('data', function (data) {
        const nfcTag = data.toString('utf8');
        console.log('A NFC tag was scanned: ', nfcTag);
        io.emit('nfc-scan', nfcTag);
    }); 
}