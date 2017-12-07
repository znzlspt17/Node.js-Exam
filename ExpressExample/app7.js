var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    console.log('첫 번째 미들웨어에서 요청을 처리함.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead('200', {
        'ConText-Type': 'text/html;charset=utf8'
    });

    res.write('<h1>express 서버에서 응답한 결과 입니다.</h1>');
    res.write('<div><p>User-Agent : ' + paramId + '</p></div>');
    res.write('<div><p>Param Name : ' + paramPassword + '</p></div>');
});

http.createServer(app).listen(3000, function () {
    console.log('express서버가 3000번 포트에서 시작됨.');
});
