// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(
        evalCode(`JSON.parse('{"foo":0,"bar":null}')`),
        { foo: 0, bar: null }
    );

    ctx.expectThrow(TypeError, evalCode, [`JSON.parse(null)`]);

    ctx.assertDeepEqual(
        evalCode(`JSON.stringify({ #a -> [0, 1], #b -> true })`),
        '{"a":[0,1],"b":true}'
    );

    ctx.assertDeepEqual(
        evalCode(`JSON.stringify({ #f -> () => () })`),
        '{}'
    );

    ctx.assertDeepEqual(
        evalCode(`JSON.stringify({ #x -> 0, #y -> 1 }, '  ')`),
        JSON.stringify({ x: 0, y: 1 }, undefined, '  ')
    );

    ctx.expectThrow(TypeError, evalCode, [`JSON.stringify(null, null)`]);

};
