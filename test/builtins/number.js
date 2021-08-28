// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(evalCode(`Number.toString(1011)`), '1011');
    ctx.assertStrictEqual(evalCode(`Number.toString(1011, 2)`), (1011).toString(2));
    ctx.expectThrow(TypeError, evalCode, [`Number.toString('1011')`]);
    ctx.expectThrow(TypeError, evalCode, [`Number.toString(1011, '2')`]);
    ctx.expectThrow(RangeError, evalCode, [`Number.toString(1011, 0)`]);

    ctx.assertStrictEqual(evalCode(`Number.toFixed(10.11)`), '10');
    ctx.assertStrictEqual(evalCode(`Number.toFixed(10.11, 2)`), (10.11).toFixed(2));
    ctx.expectThrow(TypeError, evalCode, [`Number.toFixed('10.11')`]);
    ctx.expectThrow(TypeError, evalCode, [`Number.toFixed(10.11, '2')`]);
    ctx.expectThrow(RangeError, evalCode, [`Number.toFixed(1011, -1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Number.toFixed(1011, 66)`]);

    ctx.assertStrictEqual(evalCode(`Number.toExponential(10.11)`), (10.11).toExponential());
    ctx.assertStrictEqual(evalCode(`Number.toExponential(10.11, 2)`), (10.11).toExponential(2));
    ctx.expectThrow(TypeError, evalCode, [`Number.toExponential('10.11')`]);
    ctx.expectThrow(TypeError, evalCode, [`Number.toExponential(10.11, '2')`]);
    ctx.expectThrow(RangeError, evalCode, [`Number.toExponential(1011, -1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Number.toExponential(1011, 66)`]);

    ctx.assertStrictEqual(evalCode(`Number.isFinite(2002)`), true);
    ctx.assertStrictEqual(evalCode(`Number.isFinite(NaN)`), false);
    ctx.assertStrictEqual(evalCode(`Number.isFinite(Infinity)`), false);
    ctx.assertStrictEqual(evalCode(`Number.isFinite(-Infinity)`), false);
    ctx.expectThrow(TypeError, evalCode, [`Number.isFinite('1011')`]);
    ctx.expectThrow(TypeError, evalCode, [`Number.isFinite('Infinity')`]);

    ctx.assertStrictEqual(evalCode(`Number.isInteger(2002)`), true);
    ctx.assertStrictEqual(evalCode(`Number.isInteger(10.11)`), false);
    ctx.assertStrictEqual(evalCode(`Number.isInteger(NaN)`), false);
    ctx.assertStrictEqual(evalCode(`Number.isInteger(Infinity)`), false);
    ctx.assertStrictEqual(evalCode(`Number.isInteger(-Infinity)`), false);
    ctx.expectThrow(TypeError, evalCode, [`Number.isInteger('1011')`]);
    ctx.expectThrow(TypeError, evalCode, [`Number.isInteger('Infinity')`]);

    ctx.assertStrictEqual(evalCode(`Number.isNaN(NaN)`), true);
    ctx.assertStrictEqual(evalCode(`Number.isNaN(1011)`), false);
    ctx.expectThrow(TypeError, evalCode, [`Number.isNaN('1011')`]);
    ctx.expectThrow(TypeError, evalCode, [`Number.isNaN('NaN')`]);

    ctx.assertStrictEqual(evalCode(`Number.parseInt('666')`), 666);
    ctx.assertStrictEqual(evalCode(`Number.parseInt('666', 16)`), 0x666);
    ctx.assertDeepEqual(evalCode(`Number.parseInt('666', 6)`), NaN);
    ctx.assertDeepEqual(evalCode(`Number.parseInt('0x666')`), NaN);
    ctx.assertDeepEqual(evalCode(`Number.parseInt('Infinity')`), NaN);
    ctx.expectThrow(TypeError, evalCode, [`Number.parseInt(666)`]);
    ctx.expectThrow(TypeError, evalCode, [`Number.parseInt('666', '666')`]);
    ctx.expectThrow(RangeError, evalCode, [`Number.parseInt('666', NaN)`]);

};
