// @ts-check
const { test } = require('3h-test');

test(null, {

    variable: require('./variable.js'),
    array: require('./array.js'),
    function: require('./function.js'),
    operator: require('./operator.js'),
    dict: require('./dict.js'),
    if: require('./if.js'),
    loop: require('./loop.js'),
    builtins: require('./builtins.js'),
    hello_world: require('./hello_world.js'),

}).catch(
    console.error
);
