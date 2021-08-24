// @ts-check
const { test } = require('3h-test');

test(null, {

    variable: require('./variable.js'),
    string: require('./builtins/string.js'),
    array: require('./builtins/array.js'),
    function: require('./builtins/function.js'),
    number: require('./builtins/number.js'),
    math: require('./builtins/math.js'),
    operator: require('./operator.js'),
    dict: require('./builtins/dict.js'),
    if: require('./builtins/if.js'),
    loop: require('./builtins/loop.js'),
    error: require('./builtins/error.js'),
    class: require('./builtins/class.js'),
    builtins: require('./builtins/builtins.js'),
    hello_world: require('./cli/hello_world.js'),

}).catch(
    console.error
);
