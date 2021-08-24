// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(evalCode(`Math.PI`), Math.PI);

    ctx.assertStrictEqual(evalCode(`Math.E`), Math.E);

    const x = evalCode(`Math.random()`);
    ctx.assert(x > 0 && x < 1);

    ctx.assertStrictEqual(evalCode(`Math.sign(2)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.sign(0)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.sign(-0)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.sign(-2)`), -1);
    ctx.expectThrow(TypeError, evalCode, [`Math.sign('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.floor(3.14)`), 3);
    ctx.assertStrictEqual(evalCode(`Math.floor(1)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.floor(0)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.floor(-1)`), -1);
    ctx.assertStrictEqual(evalCode(`Math.floor(-3.14)`), -4);
    ctx.expectThrow(TypeError, evalCode, [`Math.floor('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.ceil(3.14)`), 4);
    ctx.assertStrictEqual(evalCode(`Math.ceil(1)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.ceil(0)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.ceil(-1)`), -1);
    ctx.assertStrictEqual(evalCode(`Math.ceil(-3.14)`), -3);
    ctx.expectThrow(TypeError, evalCode, [`Math.ceil('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.round(3.5)`), 4);
    ctx.assertStrictEqual(evalCode(`Math.round(3.4)`), 3);
    ctx.assertStrictEqual(evalCode(`Math.round(1)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.round(0)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.round(-1)`), -1);
    ctx.assertStrictEqual(evalCode(`Math.round(-3.5)`), -3);
    ctx.assertStrictEqual(evalCode(`Math.round(-3.6)`), -4);
    ctx.expectThrow(TypeError, evalCode, [`Math.round('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.sqrt(4)`), 2);
    ctx.assertStrictEqual(evalCode(`Math.sqrt(2)`), Math.sqrt(2));
    ctx.assertStrictEqual(evalCode(`Math.sqrt(1)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.sqrt(0)`), 0);
    ctx.expectThrow(TypeError, evalCode, [`Math.sqrt('0')`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.sqrt(-1)`]);

    ctx.assertStrictEqual(evalCode(`Math.min([])`), Infinity);
    ctx.assertStrictEqual(evalCode(`Math.min([6])`), 6);
    ctx.assertStrictEqual(evalCode(`Math.min([0, 1, 2])`), 0);
    ctx.assertStrictEqual(evalCode(`Math.min([0, -1, -2])`), -2);
    ctx.assertStrictEqual(evalCode(`Math.min([0, -1, 2])`), -1);
    ctx.expectThrow(TypeError, evalCode, [`Math.min('012')`]);
    ctx.expectThrow(TypeError, evalCode, [`Math.min(['0'])`]);

    ctx.assertStrictEqual(evalCode(`Math.max([])`), -Infinity);
    ctx.assertStrictEqual(evalCode(`Math.max([6])`), 6);
    ctx.assertStrictEqual(evalCode(`Math.max([0, 1, 2])`), 2);
    ctx.assertStrictEqual(evalCode(`Math.max([0, -1, -2])`), 0);
    ctx.assertStrictEqual(evalCode(`Math.max([0, 1, -2])`), 1);
    ctx.expectThrow(TypeError, evalCode, [`Math.max('012')`]);
    ctx.expectThrow(TypeError, evalCode, [`Math.max(['0'])`]);

    ctx.assertStrictEqual(evalCode(`Math.sum([])`), 0);
    ctx.assertStrictEqual(evalCode(`Math.sum([6])`), 6);
    ctx.assertStrictEqual(evalCode(`Math.sum([0, 1, 2])`), 3);
    ctx.assertStrictEqual(evalCode(`Math.sum([0, -1, -2])`), -3);
    ctx.assertStrictEqual(evalCode(`Math.sum([0, 1, -2])`), -1);
    ctx.expectThrow(TypeError, evalCode, [`Math.sum('012')`]);
    ctx.expectThrow(TypeError, evalCode, [`Math.sum(['0'])`]);

    ctx.assertStrictEqual(evalCode(`Math.mean([6])`), 6);
    ctx.assertStrictEqual(evalCode(`Math.mean([0, 1, 2])`), 1);
    ctx.assertStrictEqual(evalCode(`Math.mean([0, -1, -2])`), -1);
    ctx.assertStrictEqual(evalCode(`Math.mean([0, 1, -2])`), -1 / 3);
    ctx.expectThrow(TypeError, evalCode, [`Math.mean('012')`]);
    ctx.expectThrow(TypeError, evalCode, [`Math.mean(['0'])`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.mean([])`]);

    ctx.assertStrictEqual(evalCode(`Math.log(2, 1)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.log(2, 2)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.log(2, 4)`), 2);
    ctx.assertStrictEqual(evalCode(`Math.log(2, Infinity)`), Infinity);
    ctx.assertStrictEqual(evalCode(`Math.log(0.5, Infinity)`), -Infinity);
    ctx.expectThrow(RangeError, evalCode, [`Math.log(-2, 1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.log(2, -1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.log(2, 0)`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.log(1, 1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.log(Infinity, 1)`]);

    ctx.assertStrictEqual(evalCode(`Math.ln(1)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.ln(Math.E)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.ln(2)`), Math.log(2));
    ctx.assertStrictEqual(evalCode(`Math.ln(Infinity)`), Infinity);
    ctx.expectThrow(RangeError, evalCode, [`Math.ln(-1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.ln(0)`]);

    ctx.assertStrictEqual(evalCode(`Math.lg(1)`), 0);
    ctx.assertStrictEqual(evalCode(`Math.lg(10)`), 1);
    ctx.assertStrictEqual(evalCode(`Math.lg(2)`), Math.log(2) / Math.LN10);
    ctx.assertStrictEqual(evalCode(`Math.lg(Infinity)`), Infinity);
    ctx.expectThrow(RangeError, evalCode, [`Math.lg(-1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Math.lg(0)`]);

    ctx.assertStrictEqual(evalCode(`Math.sin(1)`), Math.sin(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.sin('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.cos(1)`), Math.cos(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.cos('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.tan(1)`), Math.tan(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.tan('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.csc(1)`), 1 / Math.sin(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.csc('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.sec(1)`), 1 / Math.cos(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.sec('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.cot(1)`), 1 / Math.tan(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.cot('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.asin(1)`), Math.asin(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.asin('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.acos(1)`), Math.acos(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.acos('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.atan(1)`), Math.atan(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.atan('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.acsc(1)`), Math.asin(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.acsc('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.asec(1)`), Math.acos(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.asec('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.acot(1)`), Math.atan(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.acot('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.sinh(1)`), Math.sinh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.sinh('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.cosh(1)`), Math.cosh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.cosh('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.tanh(1)`), Math.tanh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.tanh('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.csch(1)`), 1 / Math.sinh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.csch('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.sech(1)`), 1 / Math.cosh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.sech('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.coth(1)`), 1 / Math.tanh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.coth('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.asinh(1)`), Math.asinh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.asinh('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.acosh(1)`), Math.acosh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.acosh('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.atanh(1)`), Math.atanh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.atanh('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.acsch(1)`), Math.asinh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.acsch('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.asech(1)`), Math.acosh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.asech('0')`]);

    ctx.assertStrictEqual(evalCode(`Math.acoth(1)`), Math.atanh(1));
    ctx.expectThrow(TypeError, evalCode, [`Math.acoth('0')`]);

};
