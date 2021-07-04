// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(evalCode(`'a\\t\\r\\n\\\\'`), 'a\t\r\n\\');
    ctx.assertStrictEqual(evalCode(`#i`), 'i');

    ctx.assertStrictEqual(evalCode(`'abc'[0]`), 'a');
    ctx.assertStrictEqual(evalCode(`'abc'[1]`), 'b');
    ctx.assertStrictEqual(evalCode(`'abc'[2]`), 'c');
    ctx.assertStrictEqual(evalCode(`'abc'[-1]`), 'c');
    ctx.assertStrictEqual(evalCode(`'abc'[-2]`), 'b');
    ctx.assertStrictEqual(evalCode(`'abc'[-3]`), 'a');

};
