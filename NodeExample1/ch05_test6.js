var http = require('http');
var fs = require('fs');
var server = http.createServer();
var port = 3000;

server.listen(port, function () {
    console.log('웹 서비스가 실행됨');
});

server.on('connection', function (socket) {
    var addr = socket.address();
    console.log('클라이언트가 접속했습니다 %s %d', addr.address, addr.port);
});

server.on('request', function (req, res) {
    console.log('클라이언트 요청 들어옴');

    var filename = 'house.gif';
    var infile = fs.createReadStream(filename, {
        flags: 'r'
    });
    var filelength = 0;
    var curlength = 0;

    fs.stat(filename, function (err, stats) {
        filelength = stats.size;
    });

    res.writeHead(200, {
        "Content-Type": "image/gif"
    });

    infile.on('readable', function () {
        var chunk;
        while (null != (chunk = infile.read())) {
            console.log('읽어 들인 데이터 크기 : %d 바이트', chunk.length);
            curlength += chunk.length;
            res.write(chunk, 'utf8', function (err) {
                console.log('파일 부분 쓰기 완료 : %d 바이트', curlength, filelength);
                if (curlength >= filelength) {
                    res.end();
                }
            });
        }
    });
    //infile.pipe(res); 헤더 정보를 담지 못하지만 다른 객체 스트림과 리스폰스를 연결해서 짧은 코드를 만들어 낼 수 있음
});

server.on('close', function () {
    console.log('서버가 종료됩니다');
});
