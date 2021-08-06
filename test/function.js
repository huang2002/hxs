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

};
