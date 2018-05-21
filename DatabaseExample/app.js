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

        var data = {
            userid: id,
            name: name,
            age: age,
            password: password
        };

        var exec = conn.query('insert into users set ?', data, function (err, result, fields) {
            conn.release();
            console.log('process target sql : ' + exec.sql);

            if (err) {
                console.log('sql error');
                console.dir(err);

                callback(err, null);
                return;
            }
            callback(null, result, fields);
        });
    });
};

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

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>사용자 추가 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</P>');
                res.end();

                return;
            }
so
            if (addedUser) {
                console.dir(addedUser);
                console.log('inserted ' + addedUser.affectRows + ' rows');

                var insertId = addedUser.insertId;
                console.log('added records ID : ' + insertId);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            } else {
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

var authUser = function (id, password, callback) {
    console.log('authUser 호출됨');
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }

            callback(err, null);
            return;
        }
        console.log('데이터베이스 쓰레드 연결 id :' + conn.threadId);

        var columns = ['userid', 'name', 'age'];
        var tablename = 'users';

        var exec = conn.query(" select ?? from ?? where userid = ? and password = ? ", [columns, tablename, id, password], function (err, rows) {
            conn.release();
            console.log('process target sql : ' + exec.sql);

            if (rows > 0) {
                console.log('아이디 [%s], 패스워드 [%s], 가 일치하는 사용자 찾음', id, password);
                callback(err, null);
            } else {
                console.log(" 일치하는 사용자를 찾지 못함. ");
                callback(null, null);
            }
        });
    });
};
router.route('/process/login').post(function (req, res) {
    console.log('/process/login 호출됨');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId, '+', paramPassword);

    if (pool) {
        authUser(paramId, paramPassword, function (err, rows) {
            if (err) {
                console.error('사용자 로그인 중 오류 발생 : ' + err.stack);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            } else if (rows) {
                console.dir(rows);
                var username = rows[0].name;

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h1> 로그인 성공 </h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</div></p>');
                res.write('<div><p>사용자 이름 : ' +paramPassword + '</div></p>');
                res.write("<br><br><a href='/public/login2.html'> 다시 로그인 하기 </a>");
                res.end();
            }
        });
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
