var Person = {};

Person['age'] = 20;
Person['name'] = 'girlgene';

var oper = function (a, b) {
    return a + b;
};

Person['add'] = oper;

console.log('add : %d', Person.add(10,2));
