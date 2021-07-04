// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(evalCode(`'a\\t\\r\\n\\\\'`), 'a\t\r\n\\');
    ctx.assertStrictEqual(evalCode(`#i`), 'i');

};
