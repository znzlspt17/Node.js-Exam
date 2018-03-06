var dgram = require('dgram');
var xinput = require('./xinputjs');


var server = dgram.createSocket('udp4');
var gaddress = null;
var gport = null;
server.on('message', function (message, rinfo) {
    console.log('server got message :' + message);
    console.log('server got from :' + rinfo.address + ' port :' + rinfo.port);
    if (message != null) {
        gaddress = rinfo.address;
        gport = rinfo.port;
        console.log("gaddress : %s / gport : %s", gaddress, gport);
    }
});

var port = 4000;

server.on('listening', function () {
    var address = server.address();
    console.log('server listening on ' + address.address + ':' + address.port);
});

server.bind(port);

[0, 1, 2, 3]
.filter(n => xinput.IsConnected(n))
    .map(n => xinput.WrapController(n, {
        interval: 20,
        deadzone: {
            x: 0.20,
            y: 0.15
        },
        holdtime: 500
    }))
    .forEach(gamepad => {
        var n = gamepad.deviceNumber;
        gamepad.addListener("button-long", (button, elapsed) => {});

        gamepad.addListener("button-short", (button, elapsed) => {});

        gamepad.addListener("button-changed", (button, state) => {});

        gamepad.addListener("analog-input", (input, data) => {

            var text = JSON.stringify(data, null, null);
            //console.log(text);

            var xValue;
            var goMsg = null;
            if (xValue = text.indexOf("\"x\"") != -1) {
                if (xValue = text.indexOf("x\":-1") != -1) {
                    goMsg = "L/999";
                } else if (xValue = text.indexOf("x\":-0.1") != -1) {
                    goMsg = "L/000";
                } else if (xValue = text.indexOf("x\":-0.2") != -1) {
                    goMsg = "L/000";
                } else if (xValue = text.indexOf("x\":-0.3") != -1) {
                    goMsg = "L/300";
                } else if (xValue = text.indexOf("x\":-0.4") != -1) {
                    goMsg = "L/400";
                } else if (xValue = text.indexOf("x\":-0.5") != -1) {
                    goMsg = "L/500";
                } else if (xValue = text.indexOf("x\":-0.6") != -1) {
                    goMsg = "L/600";
                } else if (xValue = text.indexOf("x\":-0.7") != -1) {
                    goMsg = "L/700";
                } else if (xValue = text.indexOf("x\":-0.8") != -1) {
                    goMsg = "L/800";
                } else if (xValue = text.indexOf("x\":-0.9") != -1) {
                    goMsg = "L/900";
                } else if (xValue = text.indexOf("x\":0.1") != -1) {
                    goMsg = "R/000";
                } else if (xValue = text.indexOf("x\":0.2") != -1) {
                    goMsg = "R/000";
                } else if (xValue = text.indexOf("x\":0.3") != -1) {
                    goMsg = "R/300";
                } else if (xValue = text.indexOf("x\":0.4") != -1) {
                    goMsg = "R/400";
                } else if (xValue = text.indexOf("x\":0.5") != -1) {
                    goMsg = "R/500";
                } else if (xValue = text.indexOf("x\":0.6") != -1) {
                    goMsg = "R/600";
                } else if (xValue = text.indexOf("x\":0.7") != -1) {
                    goMsg = "R/700";
                } else if (xValue = text.indexOf("x\":0.8") != -1) {
                    goMsg = "R/800";
                } else if (xValue = text.indexOf("x\":0.9") != -1) {
                    goMsg = "R/900";
                } else if (xValue = text.indexOf("x\":1,") != -1) {
                    goMsg = "R/999";
                }

            } else {

                if (xValue = text.indexOf("\"right\":1") != -1) {
                    goMsg = "A/999";
                } else if (xValue = text.indexOf("\"right\":0.9") != -1) {
                    goMsg = "A/900";
                } else if (xValue = text.indexOf("\"right\":0.8") != -1) {
                    goMsg = "A/800";
                } else if (xValue = text.indexOf("\"right\":0.7") != -1) {
                    goMsg = "A/700";
                } else if (xValue = text.indexOf("\"right\":0.6") != -1) {
                    goMsg = "A/600";
                } else if (xValue = text.indexOf("\"right\":0.5") != -1) {
                    goMsg = "A/500";
                } else if (xValue = text.indexOf("\"right\":0.4") != -1) {
                    goMsg = "A/500";
                } else if (xValue = text.indexOf("\"right\":0.3") != -1) {
                    goMsg = "A/500";
                } else if (xValue = text.indexOf("\"right\":0.2") != -1) {
                    goMsg = "A/000";
                } else if (xValue = text.indexOf("\"right\":0.1") != -1) {
                    goMsg = "A/000";
                } else if (xValue = text.indexOf("\"left\":1") != -1) {
                    goMsg = "B/999";
                } else if (xValue = text.indexOf("\"left\":0.9") != -1) {
                    goMsg = "B/900";
                } else if (xValue = text.indexOf("\"left\":0.8") != -1) {
                    goMsg = "B/800";
                } else if (xValue = text.indexOf("\"left\":0.7") != -1) {
                    goMsg = "B/700";
                } else if (xValue = text.indexOf("\"left\":0.6") != -1) {
                    goMsg = "B/600";
                } else if (xValue = text.indexOf("\"left\":0.5") != -1) {
                    goMsg = "B/500";
                } else if (xValue = text.indexOf("\"left\":0.4") != -1) {
                    goMsg = "B/500";
                } else if (xValue = text.indexOf("\"left\":0.3") != -1) {
                    goMsg = "B/500";
                } else if (xValue = text.indexOf("\"left\":0.2") != -1) {
                    goMsg = "B/000";
                } else if (xValue = text.indexOf("\"left\":0.1") != -1) {
                    goMsg = "B/000";
                }
            }
            if (gport != null && goMsg != null) {
                console.log(goMsg);
                server.send(goMsg, 0, 5, gport, gaddress);
            }
        });

        gamepad.addListener("connection-changed", (isConnected) => {
            console.log("[%d] Connection state changed: %s", n, isConnected ? "Connected!" : "Disconnected!");
        });
    });
