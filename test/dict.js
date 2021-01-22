// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { evalCode } = HXS;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.dictTests = ctx => {

    ctx.assertShallowEqual(evalCode('Dict.create()'), {});
    ctx.expectThrow(evalCode, TypeError, ['Dict.create([])']);

    ctx.assertShallowEqual(evalCode('Dict.from([])'), {});
    ctx.assertShallowEqual(evalCode("Dict.from([['a', 1], [`b`, '2']])"), { a: 1, b: '2' });
    ctx.expectThrow(evalCode, ReferenceError, ['Dict.from([]) $d; d._']);
    ctx.expectThrow(evalCode, TypeError, ['Dict.from(6)']);
    ctx.expectThrow(evalCode, TypeError, ['Dict.from([6])']);

    ctx.assertShallowEqual(evalCode("Dict.clone(Dict.from([['foo', 4]]))"), { foo: 4 });
    ctx.expectThrow(evalCode, TypeError, ['Dict.clone([])']);

    ctx.assertShallowEqual(evalCode("Dict.keys(Dict.create())"), []);
    ctx.assertShallowEqual(evalCode("Dict.keys(Dict.from([['foo', 4]]))"), ['foo']);
    ctx.assertShallowEqual(evalCode("Dict.keys(Dict.from([[#a, 0], [#b, 1]]))"), ['a', 'b']);
    ctx.expectThrow(evalCode, TypeError, ['Dict.keys([])']);

    ctx.assertStrictEqual(evalCode("Dict.has(Dict.create(), 'foo')"), false);
    ctx.assertStrictEqual(evalCode("Dict.has(Dict.from([[#bar, 'baz']]), 'foo')"), false);
    ctx.assertStrictEqual(evalCode("Dict.has(Dict.from([[#foo, 'bar']]), 'foo')"), true);
    ctx.expectThrow(evalCode, TypeError, ["Dict.has([0], 0)"]);
    ctx.expectThrow(evalCode, TypeError, ["Dict.has(Dict.from([['0', 1]]), 0)"]);

    ctx.assertShallowEqual(
        evalCode(`
            Dict.create() $o;
            Dict.set(o, 'bar', 8);
            o
        `),
        { bar: 8 }
    );
    ctx.assertStrictEqual(
        evalCode(`
            Dict.create() $a;
            Dict.set(a, 'b', 'c');
            a['b']
        `),
        'c'
    );
    ctx.assertStrictEqual(
        evalCode(`
            Dict.create() $a;
            Dict.set(a, 't', 2);
            a.t
        `),
        2
    );
    ctx.expectThrow(evalCode, TypeError, [`Dict.set([], 'a', 0)`]);
    ctx.expectThrow(evalCode, TypeError, [`Dict.set([], 0, '1')`]);

    ctx.assertShallowEqual(
        evalCode(`
            Dict.unpack(
                Dict.from([
                    ['a', 1],
                    ['b', '2']
                ]),
                ['a', 'b']
            );
            [a, b]
        `),
        [1, '2']
    );
    ctx.assertShallowEqual(
        evalCode(`
            Dict.unpack(
                Dict.from([['a', 0]]),
                ['a', 'b'],
                true
            );
            [a, b]
        `),
        [0, null]
    );
    ctx.expectThrow(evalCode, TypeError, [`Dict.unpack([], ['a'])`]);
    ctx.expectThrow(evalCode, ReferenceError, [`Dict.unpack(Dict.from([]), ['a'])`]);
};
