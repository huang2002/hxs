// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

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
            @minus(a, b) {
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
            @foo() {
                x = 6;
                z = 2;
                forward([#y, #z]);
            };
            foo();
            [x, y, z, ]
        `),
        [0, 1, 2]
    );

    ctx.assertShallowEqual(
        evalCode(`
            @list() { return(arguments) };
            list(0, 1, 10, 11)
        `),
        [0, 1, 10, 11]
    );

    ctx.assertStrictEqual(
        evalCode(`
            @sum(x) { "sum(x0, x1, ...)";
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
                b = this;
                forward([#b]);
            };
            Function.invoke(f, null, 666);
            b
        `),
        666
    );

    ctx.expectThrow(ReferenceError, evalCode, [`@f() { forward([#x]); x = 0 }; f()`]);

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
            bar = {
                #__invoke -> () => (this),
            };
            _foo = Function.bind(foo, 0);
            _bar = Function.bind(bar, 1);
            [
                Function.invoke(_foo, [1]),
                Function.bind(_foo, [2])(),
                Function.invoke(_bar, [3]),
                _bar(),
            ]
        `),
        [0, 0, 1, 1]
    );

    ctx.assertDeepEqual(
        evalCode(`
            @f() {
                g = () => ([this, that]);
                that = this;
                return(invoke(g, null, 0));
            };
            invoke(f, null, 1)
        `),
        [0, 1]
    );

    ctx.assertDeepEqual(
        evalCode(`
            @f(a, b = 1) {
                return(a + b);
            };
            g = (x, y = x + 1, z = 3) => (x + y + z);
            h = (t?) => (t);
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
            null,
        ]
    );

    ctx.expectThrow(SyntaxError, evalCode, [`@(a, b = 1, c) {}`]);
    ctx.expectThrow(SyntaxError, evalCode, [`(x = 1, y) => ()`]);

    ctx.assertStrictEqual(
        evalCode(`
            @product(x, y...) { "product(x0, x1...)";
                p = x;
                if (Array.sizeOf(y) > 0) {
                    p *= product(...y);
                };
                return(p);
            };
            product(1, 2, 3, 4, 5)
        `),
        1 * 2 * 3 * 4 * 5
    );

    ctx.assertDeepEqual(
        evalCode(`
            test = (x, y = x, z...) => ([x, y, z]);
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

    ctx.expectThrow(SyntaxError, evalCode, [`print(...{}) => ()`]);
    ctx.expectThrow(SyntaxError, evalCode, [`print(...'') => ()`]);

    ctx.assertDeepEqual(
        evalCode(`
            [
                @f() {},
                g = () => (),
                { #__invoke -> f },
                { #__invoke -> g },
                { #__invoke -> null },
                {},
                [],
                'funcion',
            ]:map((v) => (Function.isInvocable(v)))
        `),
        [
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
        ]
    );

    ctx.assertStrictEqual(
        evalCode(`
            dict = {
                @func() {},
            };
            exist(#func)
        `),
        false
    );

};
