// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(evalCode(`(666)`), 666);

    ctx.assertStrictEqual(evalCode(`666;`), null);

    ctx.assertStrictEqual(evalCode(`2 ** 3`), 8);
    ctx.assertStrictEqual(evalCode(`2 ** 3 ** 4`), 2 ** 3 ** 4);
    ctx.expectThrow(TypeError, evalCode, [`'2' ** 3`]);
    ctx.expectThrow(TypeError, evalCode, [`2 ** '3'`]);

    ctx.assertStrictEqual(evalCode(`!true`), false);
    ctx.assertStrictEqual(evalCode(`!false`), true);
    ctx.assertStrictEqual(evalCode(`!!false`), false);
    ctx.expectThrow(TypeError, evalCode, [`!0`]);
    ctx.expectThrow(TypeError, evalCode, [`!1`]);

    ctx.assertStrictEqual(evalCode(`~1011B`), ~0b1011);
    ctx.expectThrow(TypeError, evalCode, [`~true`]);

    ctx.assertStrictEqual(evalCode(`1 + 1`), 2);
    ctx.assertStrictEqual(evalCode(`1 + 2 * 3`), 7);
    ctx.assertStrictEqual(evalCode(`1 + 2 * (3 / 2)`), 4);
    ctx.assertStrictEqual(evalCode(`1 - 2 * 3 / 2`), -2);
    ctx.assertStrictEqual(evalCode(`6 + 5 % 4`), 7);
    ctx.expectThrow(TypeError, evalCode, [`1 + '1'`]);
    ctx.expectThrow(TypeError, evalCode, [`true - 1`]);

    ctx.assertStrictEqual(evalCode(`-Infinity`), -Infinity);
    ctx.expectThrow(TypeError, evalCode, [`-'1'`]);
    ctx.expectThrow(TypeError, evalCode, [`-true`]);

    ctx.assertStrictEqual(evalCode(`1 << 1`), 2);
    ctx.assertStrictEqual(evalCode(`2 >> 1`), 1);
    ctx.assertStrictEqual(evalCode(`-2 >>> 1`), -2 >>> 1);

    ctx.assertStrictEqual(evalCode(`1 > 2`), false);
    ctx.assertStrictEqual(evalCode(`1 >= 2`), false);
    ctx.assertStrictEqual(evalCode(`1 < 2`), true);
    ctx.assertStrictEqual(evalCode(`1 <= 2`), true);

    ctx.assertStrictEqual(evalCode(`1 == 2`), false);
    ctx.assertStrictEqual(evalCode(`1 === 2`), false);
    ctx.assertStrictEqual(evalCode(`1 != 2`), true);
    ctx.assertStrictEqual(evalCode(`1 !== 2`), true);

    ctx.assertStrictEqual(evalCode(`1011B & 1001B`), 0b1001);
    ctx.assertStrictEqual(evalCode(`1011B ^ 1001B`), 0b0010);
    ctx.assertStrictEqual(evalCode(`1011B | 1001B`), 0b1011);

    ctx.assertStrictEqual(evalCode(`true && true`), true);
    ctx.assertStrictEqual(evalCode(`true && false`), false);
    ctx.assertStrictEqual(evalCode(`false && true`), false);
    ctx.assertStrictEqual(evalCode(`false && false`), false);

    ctx.assertStrictEqual(evalCode(`true || true`), true);
    ctx.assertStrictEqual(evalCode(`true || false`), true);
    ctx.assertStrictEqual(evalCode(`false || true`), true);
    ctx.assertStrictEqual(evalCode(`false || false`), false);

    ctx.assertStrictEqual(evalCode(`1 ?? 0`), 1);
    ctx.assertStrictEqual(evalCode(`0 ?? 1`), 0);
    ctx.assertStrictEqual(evalCode(`false ?? true`), false);
    ctx.assertStrictEqual(evalCode(`null ?? 0`), 0);

    ctx.assertStrictEqual(evalCode(`2002:toString(2)`), (2002).toString(2));
    ctx.assertStrictEqual(evalCode(`'abcde':slice(1, -1)`), 'bcd');
    ctx.assertStrictEqual(evalCode(`'abcde':slice:invoke([1, -1])`), 'bcd');
    ctx.assertDeepEqual(evalCode(`[0, 1, 2, 3]:slice(1, -1)`), [1, 2]);
    ctx.assertDeepEqual(evalCode(`o = {}; o.foo = 'bar'; o`), { foo: 'bar' });
    ctx.assertStrictEqual(evalCode(`1 + 'abcdef':indexOf('c')`), 1 + 2);
    ctx.expectThrow(TypeError, evalCode, [`null:toString()`]);
    ctx.expectThrow(TypeError, evalCode, [`true:toString()`]);
    ctx.expectThrow(TypeError, evalCode, [`1011:undefined_method()`]);

};
