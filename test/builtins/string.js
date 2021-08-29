// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(evalCode(`'a\\t\\r\\n\\\\'`), 'a\t\r\n\\');
    ctx.assertStrictEqual(evalCode(`#i`), 'i');

    ctx.assertStrictEqual(evalCode(`'abc'[0]`), 'a');
    ctx.assertStrictEqual(evalCode(`'abc'[1]`), 'b');
    ctx.assertStrictEqual(evalCode(`'abc'[2]`), 'c');
    ctx.assertStrictEqual(evalCode(`'abc'[-1]`), 'c');
    ctx.assertStrictEqual(evalCode(`'abc'[-2]`), 'b');
    ctx.assertStrictEqual(evalCode(`'abc'[-3]`), 'a');
    ctx.expectThrow(TypeError, evalCode, [`'abc'['0']`]);
    ctx.expectThrow(RangeError, evalCode, [`'abc'[3]`]);
    ctx.expectThrow(RangeError, evalCode, [`'abc'[-4]`]);

    ctx.assertStrictEqual(evalCode(`String.sizeOf('abc')`), 3);
    ctx.expectThrow(TypeError, evalCode, [`String.sizeOf(['foo', 'bar'])`]);

    ctx.assertStrictEqual(evalCode(`String.join('a', 'b', 'c')`), 'abc');
    ctx.assertStrictEqual(evalCode(`String.join('abc', 123, true)`), 'abc123true');

    ctx.assertStrictEqual(evalCode(`String.toLowerCase('LowerCase')`), 'lowercase');
    ctx.expectThrow(TypeError, evalCode, ['String.toLowerCase(123)']);

    ctx.assertStrictEqual(evalCode(`String.toUpperCase('UpperCase')`), 'UPPERCASE');
    ctx.expectThrow(TypeError, evalCode, ['String.toUpperCase(456)']);

    ctx.assertStrictEqual(evalCode(`String.slice('012')`), '012');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 0)`), '012');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 1)`), '12');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 2)`), '2');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 3)`), '');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 0, 1)`), '0');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 1, 3)`), '12');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 1, -1)`), '1');
    ctx.assertStrictEqual(evalCode(`String.slice('012', 1, -2)`), '');
    ctx.expectThrow(TypeError, evalCode, [`String.slice(['2', '3', '3'])`]);
    ctx.expectThrow(TypeError, evalCode, [`String.slice('012', '0')`]);
    ctx.expectThrow(TypeError, evalCode, [`String.slice('012', 0, '1')`]);

    ctx.assertStrictEqual(evalCode(`String.indexOf('abcabc', 'a')`), 0);
    ctx.assertStrictEqual(evalCode(`String.indexOf('abcabc', 'c')`), 2);
    ctx.assertStrictEqual(evalCode(`String.indexOf('abcabc', 'bc')`), 1);
    ctx.expectThrow(TypeError, evalCode, [`String.indexOf(['a', 'b', 'c'], 'a')`]);
    ctx.expectThrow(TypeError, evalCode, [`String.indexOf(['0', '1', '2'], 0)`]);

    ctx.assertStrictEqual(evalCode(`String.lastIndexOf('abcabc', 'a')`), 3);
    ctx.assertStrictEqual(evalCode(`String.lastIndexOf('abcabc', 'c')`), 5);
    ctx.assertStrictEqual(evalCode(`String.lastIndexOf('abcabc', 'bc')`), 4);
    ctx.expectThrow(TypeError, evalCode, [`String.lastIndexOf(['a', 'b', 'c'], 'a')`]);
    ctx.expectThrow(TypeError, evalCode, [`String.lastIndexOf(['0', '1', '2'], 0)`]);

    ctx.assertStrictEqual(evalCode(`String.includes('abcabc', 'abc')`), true);
    ctx.assertStrictEqual(evalCode(`String.includes('abcabc', 'bac')`), false);
    ctx.expectThrow(TypeError, evalCode, [`String.includes(['a', 'b', 'c'], 'a')`]);
    ctx.expectThrow(TypeError, evalCode, [`String.includes('012', 0)`]);

    ctx.assertStrictEqual(evalCode(`String.repeat('abc', 2)`), 'abcabc');
    ctx.assertStrictEqual(evalCode(`String.repeat('abc', 1)`), 'abc');
    ctx.assertStrictEqual(evalCode(`String.repeat('abc', 0)`), '');
    ctx.expectThrow(TypeError, evalCode, [`String.repeat(['a', 'b', 'c'], 1)`]);
    ctx.expectThrow(RangeError, evalCode, [`String.repeat('012', -1)`]);
    ctx.expectThrow(RangeError, evalCode, [`String.repeat('012', Infinity)`]);

    ctx.assertStrictEqual(evalCode(`String.codePointAt('abc', 0)`), 'abc'.codePointAt(0));
    ctx.assertStrictEqual(evalCode(`String.codePointAt('abc', 1)`), 'abc'.codePointAt(1));
    ctx.assertStrictEqual(evalCode(`String.codePointAt('abc', 2)`), 'abc'.codePointAt(2));
    ctx.assertStrictEqual(evalCode(`String.codePointAt('abc', -1)`), 'abc'.codePointAt(2));
    ctx.assertStrictEqual(evalCode(`String.codePointAt('abc', -3)`), 'abc'.codePointAt(0));
    ctx.expectThrow(TypeError, evalCode, [`String.codePointAt(['a', 'b', 'c'], 1)`]);
    ctx.expectThrow(RangeError, evalCode, [`String.codePointAt('abc', 3)`]);
    ctx.expectThrow(RangeError, evalCode, [`String.codePointAt('abc', -4)`]);

};
