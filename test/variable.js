// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            x = 1;
            y = 2;
            x + y
        `),
        3
    );

    ctx.assertShallowEqual(
        evalCode(`
            a = b = c = d = e = f = 3;
            a += a;
            b -= b;
            c *= c;
            d /= d;
            e %= e;
            f **= f;
            [a, b, c, d, e, f]
        `),
        [3 + 3, 3 - 3, 3 * 3, 3 / 3, 3 % 3, 3 ** 3]
    );

    ctx.assertShallowEqual(
        evalCode(`
            x = 1010B;
            y = 1100B;
            a = b = c = d = e = x;
            a &= y;
            b ^= y;
            c |= y;
            d <<= 1;
            e >>= 1;
            [a, b, c, d, e]
        `),
        [0b1000, 0b0110, 0b1110, 0b10100, 0b0101]
    );

    ctx.assertDeepEqual(
        evalCode(`
            t = true;
            f = false;
            t &&= false;
            f ||= true;
            [t, f]
        `),
        [false, true]
    );

    ctx.assertDeepEqual(
        evalCode(`
            a = false;
            b = null;
            a ??= true;
            b ??= true;
            [a, b]
        `),
        [false, true]
    );

    ctx.expectThrow(SyntaxError, evalCode, [`0 = 0`]);

};
