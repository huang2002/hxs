// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        evalCode(`
            @foo() {
                raise('blahblah');
            };
            @bar() {
                try {
                    foo();
                } (err) {
                    try {
                        return(err);
                    } (returnFlag) {
                        return('you caught return flag');
                    }
                }
            };
            bar()
        `),
        'blahblah'
    );

};
