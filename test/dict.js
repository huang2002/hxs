// @ts-check
const { evalCode } = require('../dist/hxs.umd.js');

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
            {
                key_a -> 0,
                #b -> b,
            }
        `),
        { baz: 0, b: true }
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

    ctx.assertShallowEqual(evalCode('Dict.create()'), {});
    ctx.expectThrow(TypeError, evalCode, ['Dict.create([])']);

    ctx.assertShallowEqual(evalCode('Dict.from([])'), {});
    ctx.assertShallowEqual(evalCode("Dict.from([['a', 1], [`b`, '2']])"), { a: 1, b: '2' });
    ctx.expectThrow(TypeError, evalCode, ['Dict.from(6)']);
    ctx.expectThrow(TypeError, evalCode, ['Dict.from([6])']);

    ctx.assertShallowEqual(evalCode("Dict.clone(Dict.from([['foo', 4]]))"), { foo: 4 });
    ctx.expectThrow(TypeError, evalCode, ['Dict.clone([])']);

    ctx.assertShallowEqual(evalCode("Dict.keys(Dict.create())"), []);
    ctx.assertShallowEqual(evalCode("Dict.keys(Dict.from([['foo', 4]]))"), ['foo']);
    ctx.assertShallowEqual(evalCode("Dict.keys(Dict.from([[#a, 0], [#b, 1]]))"), ['a', 'b']);
    ctx.expectThrow(TypeError, evalCode, ['Dict.keys([])']);

    ctx.assertDeepEqual(evalCode("Dict.entries(Dict.create())"), []);
    ctx.assertDeepEqual(evalCode("Dict.entries(Dict.from([['foo', 4]]))"), [['foo', 4]]);
    ctx.assertDeepEqual(evalCode("Dict.entries(Dict.from([[#a, 0], [#b, 1]]))"), [['a', 0], ['b', 1]]);
    ctx.expectThrow(TypeError, evalCode, ['Dict.entries([])']);

    ctx.assertStrictEqual(evalCode("Dict.has(Dict.create(), 'foo')"), false);
    ctx.assertStrictEqual(evalCode("Dict.has(Dict.from([[#bar, 'baz']]), 'foo')"), false);
    ctx.assertStrictEqual(evalCode("Dict.has(Dict.from([[#foo, 'bar']]), 'foo')"), true);
    ctx.expectThrow(TypeError, evalCode, ["Dict.has([0], 0)"]);
    ctx.expectThrow(TypeError, evalCode, ["Dict.has(Dict.from([['0', 1]]), 0)"]);

    ctx.assertShallowEqual(
        evalCode(`
            dict = Dict.create();
            Dict.set(dict, 'bar', 8);
            dict
        `),
        { bar: 8 }
    );

    ctx.assertStrictEqual(
        evalCode(`
            a = Dict.create();
            Dict.set(a, 'b', 'c');
            a['b']
        `),
        'c'
    );

    ctx.assertStrictEqual(
        evalCode(`
            a = Dict.create();
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

};
