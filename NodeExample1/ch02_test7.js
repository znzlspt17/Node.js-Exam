var os = require('os');

console.log('system hostname : %s', os.hostname());
console.log('system total memory : %d / %d',os.freemem(), os.totalmem());
console.log('system cpu information\n');
console.dir(os.cpus());
console.log('system network interfaces\n');
console.dir(os.networkInterfaces());