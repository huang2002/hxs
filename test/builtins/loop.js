// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            s = 0;
            while (true) {
                if (s >= 10) {
                    break();
                };
                s = s + 1;
            };
            s
        `),
        10
    );

    ctx.assertStrictEqual(
        evalCode(`
            s = 1;
            while (s < 10) {
                s = s + 2;
            };
            s
        `),
        11
    );

    ctx.expectThrow(TypeError, evalCode, [`while (1) {}`]);

    ctx.assertStrictEqual(
        evalCode(`
            s = 0;
            for (#i, 0, 5) {
                s = s + i;
            };
            s
        `),
        0 + 1 + 2 + 3 + 4
    );

    ctx.assertStrictEqual(
        evalCode(`
            s = 0;
            for (#i, 0, 5, 2) {
                s = s + i;
            };
            s
        `),
        0 + 2 + 4
    );

    ctx.assertStrictEqual(
        evalCode(`
            s = 0;
            for (#i, 0, -5) {
                s = s + i;
            };
            s
        `),
        0 - 1 - 2 - 3 - 4
    );

    ctx.assertStrictEqual(
        evalCode(`
            s = 0;
            for (#i, 0, 10) {
                if (i < 2) {
                    continue();
                } (i >= 8) {
                    break();
                } (true) {
                    s += i;
                };
            };
            s
        `),
        2 + 3 + 4 + 5 + 6 + 7
    );

    ctx.expectThrow(TypeError, evalCode, [`for (0, 0, 10) {}`]);
    ctx.expectThrow(RangeError, evalCode, [`for (#i, 0, 10, 0) {}`]);
    ctx.expectThrow(RangeError, evalCode, [`for (#i, 0, 10, -1) {}`]);

};
