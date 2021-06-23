// @ts-check
const { test } = require('3h-test');
const { executeCode: exec } = require('../dist/hxs.umd.js');

test(null, {

    basic_variable_ops(ctx) {
        ctx.assertStrictEqual(exec(`x = 1; x = x + x; x`), 2);
        ctx.assertStrictEqual(exec(`x = y = 1; x + y`), 2);
    },

    basic_array_ops(ctx) {
        ctx.assertDeepEqual(exec(`[0, [1, 2], [3]]`), [0, [1, 2], [3]]);
    },

    basic_math_ops(ctx) {
        ctx.assertStrictEqual(exec(`-1`), -1);
        ctx.assertStrictEqual(exec(`1 + 1`), 2);
        ctx.assertStrictEqual(exec(`1 + 2 * 3`), 7);
        ctx.assertStrictEqual(exec(`1 + 2 * (3 / 2)`), 4);
        ctx.assertStrictEqual(exec(`1 - 2 * 3 / 2`), -2);
    },

    basic_function_ops(ctx) {
        ctx.assertStrictEqual(exec(`@(a, b){ return(a + b) }(1, 2)`), 3);
        ctx.assertStrictEqual(
            exec(`
                minus = @(a, b) {
                    return(a - b)
                };
                minus(1, 2)
            `),
            -1
        );
        ctx.assertShallowEqual(
            exec(`
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
    },

}).catch(console.error);
