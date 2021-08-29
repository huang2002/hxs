// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(evalCode(`getExports()`), {});
    ctx.assertStrictEqual(evalCode(`exist(#import)`), false);

    ctx.assertDeepEqual(
        evalCode(`
            foo = @() {
                export({ #foo -> 0 });
            };
            bar = () => (
                export({ #bar -> 1 });
            );
            foo();
            bar();
            export({ #baz -> 2 });
            getExports()
        `),
        { foo: 0, bar: 1, baz: 2 }
    );

};
