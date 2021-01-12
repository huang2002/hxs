// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { evalCode } = HXS;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.ifTests = ctx => {

    ctx.assertStrictEqual(
        evalCode(`
                0 $a;
                if (true) {
                    1 $a;
                };
                a
            `),
        1
    );

    ctx.assertStrictEqual(
        evalCode(`
                0 $b;
                if (false) {
                    1 $b;
                };
                b
            `),
        0
    );

    ctx.assertStrictEqual(
        evalCode(`
                if (true) {
                    0 $c;
                } (true) {
                    1 $c;
                };
                c
            `),
        0
    );

    ctx.assertStrictEqual(
        evalCode(`
                0 $d;
                if (false) {
                    1 $d;
                } (true) {
                    2 $d;
                };
                d
            `),
        2
    );

    ctx.assertStrictEqual(
        evalCode(`
                0 $e;
                if (false) {
                    1 $e;
                } (false) {
                    2 $e;
                } (true) {
                    3 $e;
                };
                e
            `),
        3
    );

    ctx.assertStrictEqual(
        evalCode(`
                0 $f;
                if (false) {
                    1 $f;
                } (true) {
                    2 $f;
                } (true) {
                    3 $f;
                };
                f
            `),
        2
    );

    ctx.expectThrow(evalCode, TypeError, [`if ('true') {}`]);
    ctx.expectThrow(evalCode, TypeError, [`if (1) {}`]);
    ctx.expectThrow(evalCode, TypeError, [`if (0) {}`]);

};
