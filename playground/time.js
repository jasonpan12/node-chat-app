const moment = require('moment');

//
// var date = new Date();
// console.log(date.getMonth());

// var date = moment();
// date.add(100, 'year').subtract(9,'month');
// console.log(date.format('MMM Do, YYYY'));

// 10:35 am
// 6:01 am

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt); // create a moment which represents a specific point in time, e.g. 1234
console.log(date.format('h:mm a'));
