var Person = {};

Person['age'] = 20;
Person['name'] = 'girlgene';
Person.add = function (a, b) {
    return a + b;
};

console.log('add : %d', Person.add(10, 20));
