// @ts-check
const { test } = require('3h-test');

test(null, {

    variable: require('./variable.js'),
    array: require('./array.js'),
    operators: require('./function.js'),
    function: require('./operator.js'),

}).catch(
    console.error
);
