// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { evalCode } = HXS;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.funcToolsTest = ctx => {

    ctx.assertStrictEqual(
        evalCode(`
            @add() {
                return(invoke(sum, arguments))
            };
            add(2, 4, 6)
        `),
        12
    );

    ctx.assertStrictEqual(evalCode(`import('func_tools').combine([boolean, number, string])('false')`), '1');
    ctx.expectThrow(evalCode, TypeError, [`import('func_tools').combine(string)`]);
    ctx.expectThrow(evalCode, RangeError, [`import('func_tools').combine([])`]);

};
