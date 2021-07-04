// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(
        evalCode(`{}`),
        {}
    );

    ctx.assertDeepEqual(
        evalCode(`{ #foo: #bar }`),
        { foo: 'bar' }
    );

    ctx.assertDeepEqual(
        evalCode(`
            key_a = 'baz';
            b = true;
            {
                key_a: 0,
                #b: b,
            }
        `),
        { baz: 0, b: true }
    );

    ctx.assertDeepEqual(
        evalCode(`
            {
                #x: 0,
                #y: {
                    #z: 2,
                },
            }
        `),
        { x: 0, y: { z: 2 } }
    );

    ctx.expectThrow(TypeError, evalCode, [`{ 0: 1 }`]);

};
