var users = [{
    name: 'girlgene',
    age: 20
}, {
    name: 'girlsday',
    age: 21
}];

console.log('push 호출 전 배열의 요소 수 %d', users.length);

users.push({
    name: 't-ara',
    age: 23
});

console.log('push 호출 후 배열의 요소 수 %d', users.length);

users.pop();

console.log('pop 호출 후 배열의 요소 수 %d', users.length);
