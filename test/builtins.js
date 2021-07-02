// @ts-check
const { evalCode, builtins, HELP_SYMBOL } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(
        evalCode(`help(help)`),
        builtins.get('help')[HELP_SYMBOL]
    );

};
