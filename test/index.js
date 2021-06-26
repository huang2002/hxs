// @ts-check
const { test } = require('3h-test');

test(null, {

    variable: require('./variable.js'),
    array: require('./array.js'),
    function: require('./function.js'),
    operator: require('./operator.js'),
    dict: require('./dict.js'),

}).catch(
    console.error
);
