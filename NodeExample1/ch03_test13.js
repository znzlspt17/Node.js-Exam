var users = [{
    name: '소녀시대',
    age: 22
}, {
    name: '걸스데이',
    age: 23
}, {
    name: '티아라',
    age: 25
}];

console.log('delete 키워드로 배열 요소 삭제 전 배열 요소의 수 %d : ', users.length);

delete users[1];

console.log('delete 키워드로 배열 요소 삭제 후');

console.dir(users);

users.splice(1, 0, {
    name: '애프터스쿨',
    age: 25
});

console.log('splice()로 요소를 인덱스 1에 추가한 후');
console.dir(users);

users.splice(2, 1);
console.log('splice()로 인덱스2의 요소를 1개 삭제한 후');
console.dir(users);
