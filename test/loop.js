// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

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

};
