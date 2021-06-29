// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            a = 0;
            if (a >= 0) {
                a = 1;
            } (true) {
                a = -1;
            };
            a
        `),
        1
    );

    ctx.assertStrictEqual(
        evalCode(`
            b = 0;
            if (b > 0) {
                b = 1;
            } (true) {
                b = -1;
            };
            b
        `),
        -1
    );

    ctx.assertStrictEqual(
        evalCode(`
            c = 0;
            d = null;
            if (c > 0) {
                d = 1;
            } (c == 0) {
                d = 0;
            } (true) {
                d = -1;
            };
            d
        `),
        0
    );

};
