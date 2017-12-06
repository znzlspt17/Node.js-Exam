var users = [{
    name: 'girlgene',
    age: 20
}, {
    name: 'girlsday',
    age: 21
}, {
    name: 't-ara',
    age: 22
}];

console.log('배열의 요소 수 : %d', users.length)
for (var i = 0; i < users.length; i++) {
    console.log('배열요소 #' + i + ' : %s', users[i].name);
}

console.log('using foreach');
users.forEach(function (item, index) {
    console.log('배열요소 #' + index + ' : %s', item.name);
});
