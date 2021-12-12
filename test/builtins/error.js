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
                    baz();
                    foo();
                } (err) {
                    try {
                        return(err);
                    } (returnFlag) {
                        return('you caught return flag');
                    }
                }
            };
            @baz() {
                if (true) {
                    return();
                }
            };
            bar()
        `),
        'Error: blahblah\n'
        + '    at unknown (Ln 3, Col 22)\n'
        + '    at unknown (Ln 8, Col 24)\n'
        + '    at unknown (Ln 6, Col 21)\n'
        + '    at unknown (Ln 9, Col 25)\n'
        + '    at unknown (Ln 22, Col 16)'
    );

};
