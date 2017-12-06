var users = [{
    name: 'sosi',
    age: 20
}, {
    name: 'girde',
    age: 21
}];

var add = function (a, b) {
    return a + b;
};

users.push(add);
console.log('array count : %d', users.length);
console.log('3rd object : %d', users[2](10, 20));
console.dir(users);
