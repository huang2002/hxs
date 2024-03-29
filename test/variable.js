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
            f = -x;
            f >>>= 1;
            [a, b, c, d, e, f]
        `),
        [0b1000, 0b0110, 0b1110, 0b10100, 0b0101, -0b1010 >>> 1]
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

    ctx.assertDeepEqual(
        evalCode(`
            a = 0;
            b = 1;
            c = 2;
            store = getContextStore();
            store.a = 10;
            f = @() {
                store.b += 10;
            };
            f();
            [a, b, c]
        `),
        [10, 11, 2]
    );

};
