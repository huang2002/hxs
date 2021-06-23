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

};
