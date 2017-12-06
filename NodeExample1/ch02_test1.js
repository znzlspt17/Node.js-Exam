console.log('현재 실행한 파일의 이름 : %s', __filename);
console.log('현재 실행한 파일의 위치 : %s', __dirname);

var result = 0;
console.time('duration_sum');

for (var i = 0; i <= 100000; i++) {
    result += i;
}

console.timeEnd('duration_sum');
console.log('1번부터 1000번까지 더한 결과물 : %d', result);

var person = {
    name: '소녀시대',
    age: 20
};

console.dir(person);
