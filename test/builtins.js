// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { evalCode } = HXS;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.builtinsTest = ctx => { // partial

    ctx.assertStrictEqual(evalCode(`typeOf(1)`), 'number');
    ctx.assertStrictEqual(evalCode(`typeOf(NaN)`), 'number');
    ctx.assertStrictEqual(evalCode(`typeOf('number')`), 'string');
    ctx.assertStrictEqual(evalCode(`typeOf(true)`), 'boolean');
    ctx.assertStrictEqual(evalCode(`typeOf(typeOf)`), 'function');
    ctx.assertStrictEqual(evalCode(`typeOf(null)`), 'null');
    ctx.assertStrictEqual(evalCode(`typeOf([])`), 'array');
    ctx.assertStrictEqual(evalCode(`typeOf(Array)`), 'dict');

    ctx.assertStrictEqual(evalCode('sum(0, 1, 2)'), 3);
    ctx.assertStrictEqual(evalCode('3 $a; 4 $b; sum(a, b, )'), 7);
    ctx.assertStrictEqual(evalCode('sum(6)'), 6);
    ctx.expectThrow(evalCode, TypeError, ['sum()']);
    ctx.expectThrow(evalCode, TypeError, ['sum("666")']);

    ctx.assertStrictEqual(evalCode('product(0, 1, 2)'), 0);
    ctx.assertStrictEqual(evalCode('3 $a; 4 $b; product(a, b, )'), 12);
    ctx.assertStrictEqual(evalCode('product(6)'), 6);
    ctx.expectThrow(evalCode, TypeError, ['product()']);
    ctx.expectThrow(evalCode, TypeError, ['product("666")']);

    ctx.assertStrictEqual(evalCode('substraction(0, 1, 2)'), -3);
    ctx.assertStrictEqual(evalCode('3 $a; 4 $b; substraction(a, b, )'), -1);
    ctx.expectThrow(evalCode, TypeError, ['substraction()']);
    ctx.expectThrow(evalCode, TypeError, ['substraction("666")']);
    ctx.expectThrow(evalCode, TypeError, ['substraction(6)']);

    ctx.assertStrictEqual(evalCode('quotient(0, 1, 2)'), 0);
    ctx.assertStrictEqual(evalCode('3 $a; 4 $b; quotient(a, b, )'), .75);
    ctx.expectThrow(evalCode, TypeError, ['quotient()']);
    ctx.expectThrow(evalCode, TypeError, ['quotient(6)']);
    ctx.expectThrow(evalCode, TypeError, ['quotient("666")']);

    ctx.assertStrictEqual(evalCode('mod(1, 2)'), 1);
    ctx.assertStrictEqual(evalCode('mod(2, 1)'), 0);
    ctx.assertStrictEqual(evalCode('mod(5, 2)'), 1);
    ctx.expectThrow(evalCode, TypeError, [`mod('1', 2)`]);
    ctx.expectThrow(evalCode, TypeError, [`mod(2, '1')`]);

    ctx.assertStrictEqual(evalCode('pow(1, 2)'), 1);
    ctx.assertStrictEqual(evalCode('pow(2, 1)'), 2);
    ctx.assertStrictEqual(evalCode('pow(2, 10)'), 1024);
    ctx.assertStrictEqual(evalCode('pow(0, 0)'), 1);
    ctx.expectThrow(evalCode, TypeError, [`pow('1', 2)`]);
    ctx.expectThrow(evalCode, TypeError, [`pow(2, '1')`]);

    ctx.assertStrictEqual(evalCode('gt(6, 5, 4)'), true);
    ctx.assertStrictEqual(evalCode('gt(6, 4, 5)'), false);
    ctx.assertStrictEqual(evalCode('gt(6, 4, 4)'), false);
    ctx.expectThrow(evalCode, TypeError, ['gt(2)']);
    ctx.expectThrow(evalCode, TypeError, ['gt("2")']);

    ctx.assertStrictEqual(evalCode('gte(6, 5, 4)'), true);
    ctx.assertStrictEqual(evalCode('gte(6, 4, 5)'), false);
    ctx.assertStrictEqual(evalCode('gte(6, 4, 4)'), true);
    ctx.expectThrow(evalCode, TypeError, ['gte(2)']);
    ctx.expectThrow(evalCode, TypeError, ['gte("2")']);

    ctx.assertStrictEqual(evalCode('lt(4, 5, 6)'), true);
    ctx.assertStrictEqual(evalCode('lt(4, 6, 5)'), false);
    ctx.assertStrictEqual(evalCode('lt(4, 6, 6)'), false);
    ctx.expectThrow(evalCode, TypeError, ['lt(2)']);
    ctx.expectThrow(evalCode, TypeError, ['lt("2")']);

    ctx.assertStrictEqual(evalCode('lte(4, 5, 6)'), true);
    ctx.assertStrictEqual(evalCode('lte(4, 6, 5)'), false);
    ctx.assertStrictEqual(evalCode('lte(4, 6, 6)'), true);
    ctx.expectThrow(evalCode, TypeError, ['lte(2)']);
    ctx.expectThrow(evalCode, TypeError, ['lte("2")']);

    ctx.assertStrictEqual(evalCode('eq(6, 6)'), true);
    ctx.assertStrictEqual(evalCode('eq(6, 6, 6)'), true);
    ctx.assertStrictEqual(evalCode('eq(2, 6)'), false);
    ctx.assertStrictEqual(evalCode('eq(6, 6, 2)'), false);
    ctx.assertStrictEqual(evalCode('eq(2, 6, 6)'), false);
    ctx.assertStrictEqual(evalCode(`eq(6, '6')`), false);
    ctx.expectThrow(evalCode, TypeError, ['eq(2)']);

    ctx.assertStrictEqual(evalCode('not(true)'), false);
    ctx.assertStrictEqual(evalCode('not(false)'), true);
    ctx.expectThrow(evalCode, TypeError, ['not(0)']);
    ctx.expectThrow(evalCode, TypeError, [`not('1')`]);

    ctx.assertStrictEqual(evalCode('and(true, true)'), true);
    ctx.assertStrictEqual(evalCode('and(true, false)'), false);
    ctx.assertStrictEqual(evalCode('and(true, true, true)'), true);
    ctx.assertStrictEqual(evalCode('and(true, true, false)'), false);
    ctx.assertStrictEqual(evalCode('and(false, true)'), false);
    ctx.assertStrictEqual(evalCode('and(false, true, true)'), false);
    ctx.expectThrow(evalCode, TypeError, [`and(true)`]);
    ctx.expectThrow(evalCode, TypeError, [`and(true, '1')`]);

    ctx.assertStrictEqual(evalCode('or(true, true)'), true);
    ctx.assertStrictEqual(evalCode('or(true, false)'), true);
    ctx.assertStrictEqual(evalCode('or(false, true)'), true);
    ctx.assertStrictEqual(evalCode('or(false, false)'), false);
    ctx.assertStrictEqual(evalCode('or(true, true, true)'), true);
    ctx.assertStrictEqual(evalCode('or(false, false, false)'), false);
    ctx.assertStrictEqual(evalCode('or(false, true, false)'), true);
    ctx.assertStrictEqual(evalCode('or(false, true, true)'), true);
    ctx.assertStrictEqual(evalCode('or(true, true, false)'), true);
    ctx.expectThrow(evalCode, TypeError, [`or(true)`]);
    ctx.expectThrow(evalCode, TypeError, [`or(false, '0')`]);

    ctx.assertStrictEqual(evalCode('number(true)'), 1);
    ctx.assertShallowEqual(evalCode('number(number)'), NaN);
    ctx.assertShallowEqual(evalCode('number("201")'), 201);
    ctx.assertShallowEqual(evalCode('number([])'), NaN);
    ctx.assertShallowEqual(evalCode('number([0, 1])'), NaN);
    ctx.assertShallowEqual(evalCode('number(Dict)'), NaN);
    ctx.assertStrictEqual(evalCode('string(true)'), 'true');
    ctx.assertStrictEqual(evalCode('string(print)'), '<function>');
    ctx.assertStrictEqual(evalCode('string([print])'), '<array>');
    ctx.assertStrictEqual(evalCode('string(Dict)'), '<dict>');
    ctx.assertStrictEqual(evalCode('boolean(0)'), false);

};
