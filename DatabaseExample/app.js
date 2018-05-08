var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    extended: 'false'
}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

var router = express.Router();

var addUser = function (id, name, age, password, callback) {
    console.log('called addUser');

    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('database connection threadid : ' + conn.threadId);

        var data = { userid: id, name: name, age: age, password: password };

        var exec = conn.query('insert into users set ?', data, function (err, result, fields) {
            conn.release();
            console.log('process target sql : ' + exec.sql);

            if (err) {
                console.log('sql error');
                console.dir(err);

                callback(err, null);
                return;
            }
            console.log('여긴가?');
            callback(null, result, fields);
        });
    });
}

router.route('/process/adduser').post(function (req, res) {
    console.log(' called /process/adduser');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramAge = req.body.age || req.query.age;

    console.log('req param : ' + paramId + ', ' + paramPassword + ', ' + paramName + ', ' + paramAge);

    if (pool) {
        addUser(paramId, paramPassword, paramName, paramAge, function (err, addedUser) {
            if (err) {
                console.log(' addUser error : ' + err.stack);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</P>');
                res.end();

                return;
            }

            if (addedUser) {
                console.dir(addedUser);
                console.log('inserted ' + addedUser.affectRows + ' rows');

                var insertId = addedUser.insertId;
                console.log('added records ID : ' + insertId);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            } else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: '192.168.0.2',
    user: 'rlawlsrn',
    password: '9898asdf',
    database: 'test',
    debug: false
});


router.route('/process/login').post(function (req, res) {
    console.log('/process/login 호출됨 라우터.라우트');
});

app.use('/', router);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다 포트 : ' + app.get('port'));
});

