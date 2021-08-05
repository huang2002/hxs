// @ts-check
const { evalCode, builtins, HELP_SYMBOL } = require('../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(evalCode(`help(help)`), builtins.get('help')[HELP_SYMBOL]);
    ctx.assertDeepEqual(evalCode(`help(Array)`), builtins.get('Array')[HELP_SYMBOL]);
    ctx.assertDeepEqual(evalCode(`help(Dict)`), builtins.get('Dict')[HELP_SYMBOL]);
    ctx.assertDeepEqual(evalCode(`help(Function)`), builtins.get('Function')[HELP_SYMBOL]);
    ctx.assertDeepEqual(evalCode(`help(Math)`), builtins.get('Math')[HELP_SYMBOL]);
    ctx.assertDeepEqual(evalCode(`help(Number)`), builtins.get('Number')[HELP_SYMBOL]);
    ctx.assertDeepEqual(evalCode(`help(String)`), builtins.get('String')[HELP_SYMBOL]);
    ctx.assertStrictEqual(typeof evalCode(`help(null)`), 'string');

    ctx.assertStrictEqual(evalCode(`help(injectHelp('foo', {}))`), 'foo');
    ctx.assertStrictEqual(evalCode(`help(injectHelp('bar', @() {}))`), 'bar');
    ctx.expectThrow(TypeError, evalCode, [`injectHelp(0, {})`]);
    ctx.expectThrow(TypeError, evalCode, [`injectHelp('baz', [])`]);

    ctx.assertStrictEqual(evalCode(`exist(#undefined)`), false);
    ctx.assertStrictEqual(evalCode(`exist(#exist)`), true);
    ctx.assertStrictEqual(evalCode(`defined = null; exist(#defined)`), true);
    ctx.expectThrow(TypeError, evalCode, [`exist(0)`]);

    ctx.assertStrictEqual(evalCode(`delete(#delete); exist(#delete)`), false);
    ctx.expectThrow(ReferenceError, evalCode, [`delete(#undefined)`]);
    ctx.expectThrow(TypeError, evalCode, [`delete(0)`]);

    ctx.assertStrictEqual(evalCode(`typeOf(1)`), 'number');
    ctx.assertStrictEqual(evalCode(`typeOf(NaN)`), 'number');
    ctx.assertStrictEqual(evalCode(`typeOf('number')`), 'string');
    ctx.assertStrictEqual(evalCode(`typeOf(true)`), 'boolean');
    ctx.assertStrictEqual(evalCode(`typeOf(typeOf)`), 'function');
    ctx.assertStrictEqual(evalCode(`typeOf(null)`), 'null');
    ctx.assertStrictEqual(evalCode(`typeOf([])`), 'array');
    ctx.assertStrictEqual(evalCode(`typeOf({})`), 'dict');

    ctx.assertStrictEqual(evalCode('number(true)'), 1);
    ctx.assertShallowEqual(evalCode('number(number)'), NaN);
    ctx.assertShallowEqual(evalCode('number("201")'), 201);
    ctx.assertShallowEqual(evalCode('number([])'), NaN);
    ctx.assertShallowEqual(evalCode('number([0, 1])'), NaN);
    ctx.assertShallowEqual(evalCode('number({})'), NaN);

    ctx.assertStrictEqual(evalCode('string(true)'), 'true');
    ctx.assertStrictEqual(evalCode('string(string)'), '<function>');
    ctx.assertStrictEqual(evalCode(`string('abc')`), "'abc'");
    ctx.assertStrictEqual(evalCode(`string('"')`), `'"'`);
    ctx.assertStrictEqual(evalCode(`string("abc")`), "'abc'");
    ctx.assertStrictEqual(evalCode(`string("isn't")`), `"isn't"`);
    ctx.assertStrictEqual(evalCode(`string('\\'"\`')`), `'\\'"\`'`);
    ctx.assertStrictEqual(evalCode('string([string])'), '(size: 1) [<function>]');
    ctx.assertStrictEqual(evalCode('string([[string]])'), '(size: 1) [<array>]');
    ctx.assertStrictEqual(evalCode('string({})'), '<dict>');

    ctx.assertStrictEqual(evalCode('boolean(1)'), true);
    ctx.assertStrictEqual(evalCode('boolean(string)'), true);
    ctx.assertStrictEqual(evalCode('boolean(0)'), false);

    ctx.assertDeepEqual(
        evalCode(`
            a = _;
            1 + 1;
            b = _;
            c = _ + _;
            @(_) {
                d = _;
                forward([#d, #e]);
                2 ** 9;
                e = _ + _;
            };
            _(2);
            [a, b, c, d, e, _]
        `),
        [null, 2, 4, null, 1024, null]
    );

    ctx.assertDeepEqual(evalCode(`a = [0, 1, 2]; set(a, 1, 10); a`), [0, 10, 2]);
    ctx.assertDeepEqual(evalCode(`o = { #a: 0 }; set(o, #b, 1); o`), { a: 0, b: 1 });
    ctx.expectThrow(TypeError, evalCode, [`set('012', 1, '10')`]);
    ctx.expectThrow(TypeError, evalCode, [`set([], '0', '10')`]);

    ctx.assertDeepEqual(evalCode(`a = [0, 1, 2]; remove(a, 1); a`), [0, 2]);
    ctx.assertDeepEqual(evalCode(`o = { #a: 0, #b: 1 }; remove(o, #b); o`), { a: 0 });
    ctx.expectThrow(TypeError, evalCode, [`remove('012', 1)`]);
    ctx.expectThrow(TypeError, evalCode, [`remove({}, 0, 1)`]);

    ctx.assertStrictEqual(evalCode(`sizeOf([0, 1, 2])`), 3);
    ctx.assertStrictEqual(evalCode(`sizeOf("abc")`), 3);
    ctx.expectThrow(TypeError, evalCode, [`sizeOf({})`]);

    ctx.assertStrictEqual(evalCode(`forEach`), evalCode(`Array.forEach`));
    ctx.assertStrictEqual(evalCode(`map`), evalCode(`Array.map`));
    ctx.assertStrictEqual(evalCode(`filter`), evalCode(`Array.filter`));
    ctx.assertStrictEqual(evalCode(`join`), evalCode(`String.join`));
    ctx.assertStrictEqual(evalCode(`keys`), evalCode(`Dict.keys`));

};
