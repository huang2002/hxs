const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            x = 1;
            x = x + x;
            x
        `),
        2
    );

    ctx.assertStrictEqual(
        evalCode(`
            x = y = 1;
            x + y
        `),
        2
    );

};
