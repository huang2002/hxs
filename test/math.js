// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { evalCode } = HXS;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.mathTests = ctx => {

    ctx.assertStrictEqual(evalCode(`import('math').PI`), Math.PI);

    ctx.assertStrictEqual(evalCode(`import('math').E`), Math.E);

    ctx.assertStrictEqual(evalCode(`import('math').sign(+2)`), Math.sign(1));
    ctx.assertStrictEqual(evalCode(`import('math').sign(0)`), Math.sign(0));
    ctx.assertStrictEqual(evalCode(`import('math').sign(-0)`), Math.sign(0));
    ctx.assertStrictEqual(evalCode(`import('math').sign(-2)`), Math.sign(-1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').sign('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').min([])`), Infinity);
    ctx.assertStrictEqual(evalCode(`import('math').min([6])`), 6);
    ctx.assertStrictEqual(evalCode(`import('math').min([0, 1, 2])`), 0);
    ctx.assertStrictEqual(evalCode(`import('math').min([0, -1, -2])`), -2);
    ctx.assertStrictEqual(evalCode(`import('math').min([0, -1, 2])`), -1);
    ctx.expectThrow(evalCode, TypeError, [`import('math').min('012')`]);
    ctx.expectThrow(evalCode, TypeError, [`import('math').min(['0'])`]);

    ctx.assertStrictEqual(evalCode(`import('math').max([])`), -Infinity);
    ctx.assertStrictEqual(evalCode(`import('math').max([6])`), 6);
    ctx.assertStrictEqual(evalCode(`import('math').max([0, 1, 2])`), 2);
    ctx.assertStrictEqual(evalCode(`import('math').max([0, -1, -2])`), 0);
    ctx.assertStrictEqual(evalCode(`import('math').max([0, 1, -2])`), 1);
    ctx.expectThrow(evalCode, TypeError, [`import('math').max('012')`]);
    ctx.expectThrow(evalCode, TypeError, [`import('math').max(['0'])`]);

    ctx.assertStrictEqual(evalCode(`import('math').sum([])`), 0);
    ctx.assertStrictEqual(evalCode(`import('math').sum([6])`), 6);
    ctx.assertStrictEqual(evalCode(`import('math').sum([0, 1, 2])`), 3);
    ctx.assertStrictEqual(evalCode(`import('math').sum([0, -1, -2])`), -3);
    ctx.assertStrictEqual(evalCode(`import('math').sum([0, 1, -2])`), -1);
    ctx.expectThrow(evalCode, TypeError, [`import('math').sum('012')`]);
    ctx.expectThrow(evalCode, TypeError, [`import('math').sum(['0'])`]);

    ctx.assertStrictEqual(evalCode(`import('math').mean([6])`), 6);
    ctx.assertStrictEqual(evalCode(`import('math').mean([0, 1, 2])`), 1);
    ctx.assertStrictEqual(evalCode(`import('math').mean([0, -1, -2])`), -1);
    ctx.assertStrictEqual(evalCode(`import('math').mean([0, 1, -2])`), -1 / 3);
    ctx.expectThrow(evalCode, TypeError, [`import('math').mean('012')`]);
    ctx.expectThrow(evalCode, TypeError, [`import('math').mean(['0'])`]);
    ctx.expectThrow(evalCode, RangeError, [`import('math').mean([])`]);

    ctx.assertStrictEqual(evalCode(`import('math').log(2, 1)`), 0);
    ctx.assertStrictEqual(evalCode(`import('math').log(2, 2)`), 1);
    ctx.assertStrictEqual(evalCode(`import('math').log(2, 4)`), 2);
    ctx.assertStrictEqual(evalCode(`import('math').log(2, infinity)`), Infinity);
    ctx.assertStrictEqual(evalCode(`import('math').log(0.5, infinity)`), -Infinity);
    ctx.expectThrow(evalCode, RangeError, [`import('math').log(-2, 1)`]);
    ctx.expectThrow(evalCode, RangeError, [`import('math').log(2, -1)`]);
    ctx.expectThrow(evalCode, RangeError, [`import('math').log(2, 0)`]);
    ctx.expectThrow(evalCode, RangeError, [`import('math').log(1, 1)`]);
    ctx.expectThrow(evalCode, RangeError, [`import('math').log(infinity, 1)`]);

    ctx.assertStrictEqual(evalCode(`import('math').ln(1)`), 0);
    ctx.assertStrictEqual(evalCode(`import('math').ln(import('math').E)`), 1);
    ctx.assertStrictEqual(evalCode(`import('math').ln(2)`), Math.log(2));
    ctx.assertStrictEqual(evalCode(`import('math').ln(infinity)`), Infinity);
    ctx.expectThrow(evalCode, RangeError, [`import('math').ln(-1)`]);
    ctx.expectThrow(evalCode, RangeError, [`import('math').ln(0)`]);

    ctx.assertStrictEqual(evalCode(`import('math').lg(1)`), 0);
    ctx.assertStrictEqual(evalCode(`import('math').lg(10)`), 1);
    ctx.assertStrictEqual(evalCode(`import('math').lg(2)`), Math.log(2) / Math.LN10);
    ctx.assertStrictEqual(evalCode(`import('math').lg(infinity)`), Infinity);
    ctx.expectThrow(evalCode, RangeError, [`import('math').lg(-1)`]);
    ctx.expectThrow(evalCode, RangeError, [`import('math').lg(0)`]);

    ctx.assertStrictEqual(evalCode(`import('math').sin(1)`), Math.sin(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').sin('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').cos(1)`), Math.cos(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').cos('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').tan(1)`), Math.tan(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').tan('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').csc(1)`), 1 / Math.sin(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').csc('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').sec(1)`), 1 / Math.cos(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').sec('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').cot(1)`), 1 / Math.tan(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').cot('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').asin(1)`), Math.asin(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').asin('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').acos(1)`), Math.acos(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').acos('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').atan(1)`), Math.atan(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').atan('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').acsc(1)`), Math.asin(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').acsc('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').asec(1)`), Math.acos(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').asec('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').acot(1)`), Math.atan(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').acot('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').sinh(1)`), Math.sinh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').sinh('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').cosh(1)`), Math.cosh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').cosh('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').tanh(1)`), Math.tanh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').tanh('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').csch(1)`), 1 / Math.sinh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').csch('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').sech(1)`), 1 / Math.cosh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').sech('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').coth(1)`), 1 / Math.tanh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').coth('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').asinh(1)`), Math.asinh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').asinh('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').acosh(1)`), Math.acosh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').acosh('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').atanh(1)`), Math.atanh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').atanh('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').acsch(1)`), Math.asinh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').acsch('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').asech(1)`), Math.acosh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').asech('0')`]);

    ctx.assertStrictEqual(evalCode(`import('math').acoth(1)`), Math.atanh(1));
    ctx.expectThrow(evalCode, TypeError, [`import('math').acoth('0')`]);

};
