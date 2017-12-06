var http = require('http');
var fs = require('fs');
var server = http.createServer();
var port = 3000;

server.listen(port, function () {
    console.log('웹 서비스가 실행됨');
});

server.on('connection', function (socket) {
    var addr = socket.address();
    console.log('클라이언트가 접속했습니다 : %s %d', addr.address, addr.port);
});

server.on('request', function (req, res) {
    console.log('클라이언트 요청 들어옴');

    var filename = 'house.gif';

    fs.readFile(filename, function (err, data) {
        res.writeHead(200, {
            "Content-Type": "image/gif"
        });
        res.write(data);
        res.end();
    });
});
L
server.on('close', function () {
    console.log('서버가 종료됩니다');
});
