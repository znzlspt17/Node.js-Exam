var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

var mongoose = require('mongoose');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({
    extended: false
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

var MongoClient = require('mongodb').MongoClient;

var database;
//몽구스 추가
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    console.log('db 접속 시도');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoos connection error'));
    database.on('open', function () {
        console.log('몽구스를 통한 db 접속 성공 : ' + databaseUrl);

        UserSchema = mongoose.Schema({
            id: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true,
                unique: true
            }
        });

        console.log('UserSchema 정의');

        UserModel = mongoose.model(" users ", UserSchema);
        console.log('UserModel 정의함');
    });

    database.on('disconnected', function () {
        console.log('연결 끊어짐 5초 후 재접속');
        setInterval(connectDB, 5000);
    });

    //버전업 삭제 몽구스 추가
    //    MongoClient.connect(databaseUrl, function (err, db) {
    //        if (err) {
    //            throw err;
    //        }
    //        console.log('데이터베이스에 연결되었습니다 : ' + databaseUrl);
    //        database = db.db('local');
    //    });
}

var authUser = function (database, id, password, callback) {
    console.log('called authUser');
    //--
    UserModel.find({
        "id": id,
        "password": password
    }, function (err, results) {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과', id, password);
        console.dir(results);

        if (results.length > 0) {
            console.log('일치하는 사용자 정보 찾음', id, password);
            callback(null, results);
        } else {
            console.log("일치하는 사용자를 찾지 못함");
            callback(null, null);
        }
    });
}
//--
//몽구스로 변경
//    var users = database.collection('users');
//
//    users.find({
//        "id": id,
//        "password": password
//    }).toArray(function (err, docs) {
//        if (err) {
//            callback(err, null);
//            return;
//        }
//
//        if (docs.length > 0) {
//            console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음', id, password);
//            callback(null, docs);
//        } else {
//            console.log("일치하는 사용자를 찾지 못함");
//            callback(null, null);
//        }
//    });
//}

app.post('/process/login', function (req, res) {
    console.log('called /process/login 앱.포스트');

    var paramId = req.param('id');
    var paramPassword = req.param('password');

    if (database) {
        authUser(database, paramId, paramPassword, function (err, docs) {
            if (err) {
                throw err;
            }

            if (docs) {
                console.dir(docs);
                var username = docs[0].name;
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<div><p><a href='/public/login.html'>다시 로그인하기</a></p></div>");
                res.end();
            } else {
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오</p></div>');
                res.write("<div><p><a href='/public/login.html'>다시 로그인하기</a></p></div>");
                res.end();
            }
        });
    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h1>로그인 실패</h1>');
        res.write('<div><p>데이터 베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.route('/process/login').post(function (req, res) {
    console.log('/process/login 호출됨 라우터.라우트');
});

router.route('/process/adduser').post(function (req, res) {
    console.log('/process/adduser 호출됨');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ',' + paramPassword + ',' + paramName);

    if (database) {
        addUser(database, paramId, paramPassword, paramName, function (err, result) {
            if (err) {
                throw err;
            }

            if (result && result.insertedCount > 0) {
                console.dir(result);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            } else {
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>DB 연결 실패</h2>');
        res.end();
    }
});

app.use('/', router);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var addUser = function (database, id, password, name, callback) {
    console.log('addUser 호출됨 : ' + id + ',' + password + ',' + name);

    var user = new UserModel({
        "id": id,
        "password": password,
        "name": name
    });

    //save 디비 저장
    user.save(function (err) {
        if (err) {
            callback(err, null);
            return;
        }
        console.log('사용자 데이터 추가함');
        callback(null, user);
    });
}
// 몽구스 추가
//    var users = database.collection('users');
//
//    users.insertMany([{
//        "id": id,
//        "password": password,
//        "name": name
//    }], function (err, result) {
//        if (err) {
//            callback(err, null);
//            return;
//        }
//
//        if (result.insertedCount > 0) {
//            console.log("사용자 레코드 추가됨 : " + result.insertedCount);
//        } else {
//            console.log("추가된 레코드가 없음.");
//        }
//
//        callback(null, result);
//    });
//}

http.createServer(app).listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다 포트 : ' + app.get('port'));
    connectDB();
});
