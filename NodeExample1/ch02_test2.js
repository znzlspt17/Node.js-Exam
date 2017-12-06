console.log('argv 속성의 파라미터 : ' + process.argv.length);
console.dir(process.argv);

if (process.argv.length > 2) {
    console.log('3rd parameter value : %s', process.argv[2]);
}

process.argv.forEach(function (item, index) {
    console.log(index + ' : ', item);
});
