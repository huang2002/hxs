// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`@(a, b){ return(a + b) }(1, 2)`),
        3
    );

    ctx.assertStrictEqual(
        evalCode(`
            minus = @(a, b) {
                return(a - b);
            };
            minus(1, 2)
        `),
        -1
    );

    ctx.assertShallowEqual(
        evalCode(`
            x = 0;
            y = 1;
            foo = @() {
                x = 6;
                forward([#y, #z]);
                z = 2;
            };
            foo();
            [x, y, z, ]
        `),
        [0, 1, 2]
    );

    ctx.assertShallowEqual(
        evalCode(`
            list = @() { return(arguments) };
            list(0, 1, 10, 11)
        `),
        [0, 1, 10, 11]
    );

    ctx.assertStrictEqual(
        evalCode(`
            sum = @(x) { "sum(x0, x1, ...)";
                s = x;
                more = Array.slice(arguments, 1);
                if (Array.sizeOf(more) > 0) {
                    s += Function.invoke(sum, more);
                };
                return(s);
            };
            sum(1, 2, 3, 4, 5)
        `),
        1 + 2 + 3 + 4 + 5
    );

    ctx.assertStrictEqual(
        evalCode(`
            f = @() {
                forward([#b]);
                b = this;
            };
            Function.invoke(f, [], 666);
            b
        `),
        666
    );

    ctx.assertDeepEqual(
        evalCode(`
            x = 0;
            f = (y) => (x = x + y);
            [f(1), x]
        `),
        [1, 0]
    );

    ctx.assertDeepEqual(
        evalCode(`
            foo = @() {
                return(this);
            };
            bar = Function.bind(foo, 0);
            [Function.invoke(bar, [1]), Function.bind(bar, 2)()]
        `),
        [0, 0]
    );

    ctx.assertDeepEqual(
        evalCode(`
            f = @(a, b = 1) {
                return(a + b);
            };
            g = (x, y = 2, z = 3) => (x + y + z);
            h = (t = 0) => (t);
            [
                f(1, 2),
                f(1),
                g(1, 2, 3),
                g(0, 1),
                g(1),
                h(6),
                h(),
            ]
        `),
        [
            1 + 2,
            1 + 1,
            1 + 2 + 3,
            0 + 1 + 3,
            1 + 2 + 3,
            6,
            0,
        ]
    );

    ctx.expectThrow(SyntaxError, evalCode, [`@(a, b = 1, c) {}`]);
    ctx.expectThrow(SyntaxError, evalCode, [`(x = 1, y) => ()`]);

    ctx.assertStrictEqual(
        evalCode(`
            product = @(x, y...) { "product(x0, x1...)";
                p = x;
                if (Array.sizeOf(y) > 0) {
                    p *= Function.invoke(product, y);
                };
                return(p);
            };
            product(1, 2, 3, 4, 5)
        `),
        1 * 2 * 3 * 4 * 5
    );

    ctx.assertDeepEqual(
        evalCode(`
            test = (x, y = 1, z...) => ([x, y, z]);
            [
                test(1),
                test(1, 2),
                test(1, 2, 3),
                test(1, 2, 3, 4),
            ]
        `),
        [
            [1, 1, []],
            [1, 2, []],
            [1, 2, [3]],
            [1, 2, [3, 4]],
        ]
    );

    ctx.expectThrow(SyntaxError, evalCode, [`@(a, b..., c = null) {}`]);
    ctx.expectThrow(SyntaxError, evalCode, [`(x..., y) => ()`]);

};
