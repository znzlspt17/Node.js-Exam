var users = [{
    name: 'girsgene',
    age: 20
}, {
    name: 'girlsday',
    age: 21
}, {
    name: 't-ara',
    age: 33
}];

console.log('unshift 호출 전 배열 요소의 수 : %d', users.length);

users.unshift({
    name: 't-ara',
    age: 33
});


console.log('unshift 호출 후 배열 요소의 수 : %d', users.length);

users.shift();


console.log('shift 호출 후 배열 요소의 수 : %d', users.length);
