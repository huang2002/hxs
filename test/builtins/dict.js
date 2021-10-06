// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(evalCode(`{}`), {});

    ctx.assertDeepEqual(
        evalCode(`{ #foo -> #bar }`),
        { foo: 'bar' }
    );

    ctx.assertStrictEqual(evalCode(`{ #foo -> #bar }.foo`), 'bar');
    ctx.assertStrictEqual(evalCode(`{ #foo -> #bar }.baz`), null);

    ctx.assertDeepEqual(
        evalCode(`
            key_a = 'baz';
            b = true;
            c = 666;
            {
                key_a -> 0,
                #b -> b,
                #c,
            }
        `),
        { baz: 0, b: true, c: 666 }
    );

    ctx.assertDeepEqual(
        evalCode(`
            {
                #x -> 0,
                #y -> {
                    #z -> 2,
                },
            }
        `),
        { x: 0, y: { z: 2 } }
    );

    ctx.expectThrow(TypeError, evalCode, [`{ 0 -> 1 }`]);

    ctx.assertShallowEqual(evalCode('Dict()'), {});
    ctx.assertShallowEqual(evalCode('Dict([])'), {});
    ctx.assertShallowEqual(evalCode("Dict([['a', 1], [`b`, '2']])"), { a: 1, b: '2' });
    ctx.expectThrow(TypeError, evalCode, ['Dict(6)']);
    ctx.expectThrow(TypeError, evalCode, ['Dict([6])']);
    ctx.expectThrow(TypeError, evalCode, ['Dict([0, 1])']);
    ctx.expectThrow(TypeError, evalCode, [`Dict([[#foo, 'bar'], [2, '3']])`]);

    ctx.assertShallowEqual(evalCode("Dict.clone(Dict([['foo', 4]]))"), { foo: 4 });
    ctx.expectThrow(TypeError, evalCode, ['Dict.clone([])']);

    ctx.assertShallowEqual(evalCode("Dict.keys(Dict())"), []);
    ctx.assertShallowEqual(evalCode("Dict.keys(Dict([['foo', 4]]))"), ['foo']);
    ctx.assertShallowEqual(evalCode("Dict.keys(Dict([[#a, 0], [#b, 1]]))"), ['a', 'b']);
    ctx.expectThrow(TypeError, evalCode, ['Dict.keys([])']);

    ctx.assertDeepEqual(evalCode("Dict.entries(Dict())"), []);
    ctx.assertDeepEqual(evalCode("Dict.entries(Dict([['foo', 4]]))"), [['foo', 4]]);
    ctx.assertDeepEqual(evalCode("Dict.entries(Dict([[#a, 0], [#b, 1]]))"), [['a', 0], ['b', 1]]);
    ctx.expectThrow(TypeError, evalCode, ['Dict.entries([])']);

    ctx.assertStrictEqual(evalCode("Dict.has(Dict(), 'foo')"), false);
    ctx.assertStrictEqual(evalCode("Dict.has(Dict([[#bar, 'baz']]), 'foo')"), false);
    ctx.assertStrictEqual(evalCode("Dict.has(Dict([[#foo, 'bar']]), 'foo')"), true);
    ctx.expectThrow(TypeError, evalCode, ["Dict.has([0], 0)"]);
    ctx.expectThrow(TypeError, evalCode, ["Dict.has(Dict([['0', 1]]), 0)"]);

    ctx.assertShallowEqual(
        evalCode(`
            dict = Dict();
            Dict.set(dict, 'bar', 8);
            dict
        `),
        { bar: 8 }
    );

    ctx.assertStrictEqual(
        evalCode(`
            a = Dict();
            Dict.set(a, 'b', 'c');
            a['b']
        `),
        'c'
    );

    ctx.assertStrictEqual(
        evalCode(`
            a = Dict();
            Dict.set(a, 't', 2);
            a.t
        `),
        2
    );

    ctx.expectThrow(TypeError, evalCode, [`Dict.set([], 'a', 0)`]);
    ctx.expectThrow(TypeError, evalCode, [`Dict.set([], 0, '1')`]);

    ctx.assertShallowEqual(
        evalCode(`
            Dict.unpack(
                Dict([
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
                Dict([['a', 0]]),
                ['a', 'b'],
                true
            );
            [a, b]
        `),
        [0, null]
    );

    ctx.expectThrow(TypeError, evalCode, [`Dict.unpack([], ['a'])`]);
    ctx.expectThrow(ReferenceError, evalCode, [`Dict.unpack({}, ['a'])`]);

    ctx.assertDeepEqual(
        evalCode(`
            o = {
                #a -> 0,
                #b -> 1,
            };
            Dict.remove(o, #a);
            o
        `),
        { b: 1 }
    );

    ctx.expectThrow(TypeError, evalCode, [`Dict.remove([], '0')`]);
    ctx.expectThrow(TypeError, evalCode, [`Dict.remove({}, 0)`]);

    ctx.assertDeepEqual(
        evalCode(`
            foo = {
                #a -> 0,
                #b -> 1,
            };
            bar = {
                #b -> -1,
                #c -> 2,
            };
            baz = Dict.assign(foo, bar);
            [baz, bar, baz == foo]
        `),
        [
            { a: 0, b: -1, c: 2 },
            { b: -1, c: 2 },
            true,
        ]
    );

    ctx.assertDeepEqual(
        evalCode(`
            foo = {
                #a -> 0,
                #b -> 1,
            };
            bar = {
                #b -> -1,
                #c -> 2,
            };
            baz = Dict.assign(foo, bar, false);
            [baz, bar, baz == foo]
        `),
        [
            { a: 0, b: 1, c: 2 },
            { b: -1, c: 2 },
            true,
        ]
    );

    ctx.expectThrow(TypeError, evalCode, [`Dict.assign([], {})`]);
    ctx.expectThrow(TypeError, evalCode, [`Dict.assign({}, [])`]);
    ctx.expectThrow(TypeError, evalCode, [`Dict.assign({}, {}, 0)`]);

    ctx.assertDeepEqual(
        evalCode(`
            foo = {
                #a -> 0,
                #b -> 1,
            };
            bar = {
                #b -> -1,
                #c -> 2,
            };
            [
                { ...foo, ...bar },
                { ...bar, ...foo },
                { #a -> 10, ...foo, #c -> 20 },
            ]
        `),
        [
            { a: 0, b: -1, c: 2 },
            { a: 0, b: 1, c: 2 },
            { a: 0, b: 1, c: 20 },
        ]
    );

    ctx.expectThrow(TypeError, evalCode, [`{ ...[] }`]);
    ctx.expectThrow(TypeError, evalCode, [`{ ...'abc' }`]);

    ctx.assertDeepEqual(
        evalCode(`
            Dict.diff({}, {})
        `),
        {}
    );
    ctx.assertDeepEqual(
        evalCode(`
            Dict.diff({ #a -> 0 }, {})
        `),
        { a: 0 }
    );
    ctx.assertDeepEqual(
        evalCode(`
            Dict.diff({}, { #a -> 0 })
        `),
        {}
    );
    ctx.assertDeepEqual(
        evalCode(`
            Dict.diff({ #a -> 0 }, { #b -> 1 })
        `),
        { a: 0 }
    );
    ctx.assertDeepEqual(
        evalCode(`
            Dict.diff({ #a -> NaN }, { #a -> NaN })
        `),
        {}
    );
    ctx.assertDeepEqual(
        evalCode(`
            Dict.diff({ #a -> 0, #b -> 1 }, { #b -> 1 })
        `),
        { a: 0 }
    );
    ctx.assertDeepEqual(
        evalCode(`
            Dict.diff({ #a -> 0, #b -> 1 }, { #b -> 2 })
        `),
        { a: 0, b: 1 }
    );
    ctx.expectThrow(TypeError, evalCode, [`Dict.diff([], {})`]);
    ctx.expectThrow(TypeError, evalCode, [`Dict.diff({}, [])`]);

};
