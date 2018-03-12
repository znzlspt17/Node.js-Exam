//기본 모듈
var express = require('express'),
    http = require('http'),
    path = require('path');

//익스프레스 미들웨어
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

//오류 핸들러
var expressErrorHandler = require('express-error-handler');
//세션 미들웨어
var expressSession = require('express-session');

//멀티파트, fs 미들웨어
var multer = require('multer');
var fs = require('fs');

//ajax 요청시 cors(다중서버접속) 지원
var cors = require('cors');

//익스프레스 객체 생성
var app = express();
//포트 설정
app.set('port', process.env.PORT || 3000);
//body parser를 ㅗㅇ해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({
    entended: false
}));

//바디파서로 애플리케이션/제이슨 파싱
app.use(bodyParser.json());


//폴뎌 경로 지정및 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

//쿠키 사용
app.use(cookieParser());

//세션 사용
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
//cors 사용
app.use(cors());

//multer 미들웨어 사용 미들웨어 사용 순서 중요 바디파서 > 멀터 > 라우터 
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + Date.now())
    }
});

//파일제한 10개 1g
var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        filesize: 1024 * 1024 * 1024
    }
});

//라우터 사용 라우팅 함수 등록
var router = express.Router();

router.route('/process/photo').post(upload.array('photo', 1), function (req, res) {
    console.log('/process/photo 호출됨.');

    try {
        var files = req.files;

        console.dir('#==== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#')

        //현재의 파일 정보를 저장할 변수 선언
        var originalname = '',
            filename = '',
            mimetype = '',
            size = 0;

        if (Array.isArray(files)) {
            console.log("배열에 들어있는 파일 갯수 : %d", files.length);

            for (var index = 0; index < files.length; index++) {
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        } else { //배열에 들어가 있지 않은 경우 (현재 설정에서는 상관없음) 무슨 소린지 모르겠네
            console.log("파일 갯수 : 1");

            originalname = files[index].originalname;
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
        console.log('현재 파일 정보 : ' + originalname + ',' + filename + ',' + mimetype + ',' + size);

        //클라이언트에 응답 전송
        res.write('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h3>파일 업로드 성공</h3>');
        res.write('<hr/>');
        res.write('<p>원본 파일 이름 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
        res.write('<p>MIME type : ' + mimetype + '</p>');
        res.write('<p>파일 크기 : ' + size + '</p>');
        res.end();
    } catch (err) {
        console.dir(err.stack);
    }

});

app.use('/', router);

http.createServer(app).listen(3000, function () {
    console.log('express서버가 3000번 포트에서 시작됨.');
});
