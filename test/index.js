// @ts-check
const { test } = require('3h-test');

test(null, {

    variable: require('./variable.js'),
    operator: require('./operators.js'),

    string: require('./builtins/string.js'),
    array: require('./builtins/array.js'),
    function: require('./builtins/function.js'),
    number: require('./builtins/number.js'),
    math: require('./builtins/math.js'),
    dict: require('./builtins/dict.js'),
    json: require('./builtins/json.js'),
    if: require('./builtins/if.js'),
    loop: require('./builtins/loop.js'),
    error: require('./builtins/error.js'),
    class: require('./builtins/class.js'),
    module: require('./builtins/module.js'),
    builtins: require('./builtins/builtins.js'),

    cli: require('./cli/cli.js'),

});
