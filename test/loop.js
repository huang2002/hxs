// @ts-check
const HX = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/3h-exp.umd.js'))
);

const { evalCode } = HX;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.loopTests = ctx => {

    ctx.assertStrictEqual(
        evalCode(`
            0 $s;
            for ('i', 1, 5) {
                sum(s, i) $s;
            };
            s
        `),
        1 + 2 + 3 + 4
    );

    ctx.assertStrictEqual(
        evalCode(`
            0 $x;
            for ('i', 1, 9) {
                if (gt(i, 5)) {
                    break();
                };
                i $x;
            };
            x
        `),
        5
    );

    ctx.assertStrictEqual(
        evalCode(`
            0 $s;
            for ('i', 0, 10) {
                if (eq(0, mod(i, 2))) {
                    continue();
                };
                sum(s, i) $s;
            };
            s
        `),
        1 + 3 + 5 + 7 + 9
    );

    ctx.assertStrictEqual(
        evalCode(`
            0 $s;
            1 $x;
            while (lte(x, 9)) {
                sum(s, x) $s;
                sum(x, 1) $x;
            };
            s
        `),
        (1 + 9) * 9 / 2
    );

};
