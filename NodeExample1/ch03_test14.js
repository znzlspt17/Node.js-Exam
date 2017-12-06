var users = [{
    name: 'first',
    age: 10
}, {
    name: 'second',
    age: 20
}, {
    name: 'third',
    age: 30
}, {
    name: 'fourth',
    age: 40
}];


console.log('배열 요소의 수 : %d', users.length);

console.log('원본 users');
console.dir(users);

var users2 = users.slice(1, 3);

console.log('slice로 잘라낸 users');
console.dir(users2);
        
var users3 = users2.slice(1);
console.log('slice로 잘라낸 users2');
console.dir(users3);
