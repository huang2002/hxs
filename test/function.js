// @ts-check
const HX = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { evalCode } = HX;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.functionTests = ctx => {

    ctx.assertShallowEqual(
        evalCode(`
            set('f', @(#a, #b,) {
                return([a, b]);
            });
            f(0, '1')
        `),
        [0, '1']
    );

    ctx.assertStrictEqual(
        evalCode(`
            'hi' $s;
            @f() {
                return(s);
            };
            f()
        `),
        'hi'
    );

    ctx.assertShallowEqual(
        evalCode(`
            'foo' $s;
            @f() {
                'bar' $s;
                666 $x;
            };
            f();
            [s, exist('x')]
        `),
        ['foo', false]
    );

    ctx.assertStrictEqual(
        evalCode(`
            0 $x;
            @a() {
                return(@() {
                    return(x);
                });
            };
            1 $x;
            a() $b;
            2 $x;
            b()
        `),
        1
    );

};
