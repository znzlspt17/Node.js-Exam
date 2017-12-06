var calc = {};
calc.add = function (a, b) {
    return a + b;
}

console.log('모듈로 분리하기전 calc.add함수 호출 결광 : %d', calc.add(10, 10));
