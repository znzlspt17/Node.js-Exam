var dgram = require('dgram');
var host = process.argv[2];
var port = parseInt(process.argv[3], 10);
var client = dgram.createSocket('udp4');
process.stdin.resume();


for(var i = 0; i < 3; i++) {
    console.log(process.argv[i]);
}

process.stdin.on('data', function (data) {
    client.send(data, 0, data.length, port, host);
});

client.on('message', function (message) {
    console.log('Get message back:', message.toString());
});
console.log('Start typing to send message to %s:%s', host, port);
