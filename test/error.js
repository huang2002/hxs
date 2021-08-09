// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            foo = @() {
                raise('blahblah');
            };
            bar = @() {
                try {
                    foo();
                } (err) {
                    return(err);
                }
            };
            bar()
        `),
        'blahblah'
    );

};
