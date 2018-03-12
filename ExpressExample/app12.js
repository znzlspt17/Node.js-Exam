var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var app = express();
var router = express.Router();

app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(static(path.join(__dirname, '/')));
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

router.route('/process/product').get(function (req, res) {
    console.log('/process/product 호출됨.');
    if (req.session.user) {
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login2.html');
    }
});

router.route('/process/login').post(function (req, res) {
    console.log('/process/login 호출됨');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if (req.session.user) {
        console.log('이미 로그인되어 상품 페이지로 이동합니다.');
        res.redirect('/public/product.html');
    } else {
        req.session.user = {
            id: paramId,
            name: '소녀시대',
            authorized: true
        };

        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf-8'
        });
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>Param Id : ' + paramId + '</p></div>');
        res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
        res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
        res.end();
    }
});

router.route('/process/logout').get(function (req, res) {
    console.log('/process/logout 호출됨');

    if (req.session.user) {
        console.log('로그아웃 합니다');
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            }

            console.log('세션을 삭제하고 로그아웃되었습니다.');
            res.redirect('/public/login2.html');
        });
    } else {
        console.log('아직 로그인되어 있지 않습니다.');
        res.redirect('/public/login2.html');
    }
});


app.use('/', router);

http.createServer(app).listen(3000, function () {
    console.log('express서버가 3000번 포트에서 시작됨.');
});
