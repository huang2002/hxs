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
            a = b = c = d = 3;
            a += a;
            b -= b;
            c *= c;
            d /= d;
            [a, b, c, d]
        `),
        [6, 0, 9, 1]
    );

    ctx.assertShallowEqual(
        evalCode(`
            x = 1010B;
            y = 1100B;
            a = b = c = x;
            a &= y;
            b ^= y;
            c |= y;
            [a, b, c]
        `),
        [0b1000, 0b0110, 0b1110]
    );

};
