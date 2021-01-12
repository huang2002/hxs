// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { evalCode } = HXS;

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.arrayTests = ctx => {

    ctx.assertShallowEqual(evalCode('[]'), []);
    ctx.assertShallowEqual(evalCode('[,]'), [null]);
    ctx.assertShallowEqual(evalCode('[2, "6",]'), [2, '6']);
    ctx.assertShallowEqual(evalCode('[0, "", `1`]'), [0, '', '1']);
    ctx.assertShallowEqual(evalCode('[0, "", `1`][0]'), 0);
    ctx.assertStrictEqual(evalCode('[0, "", `1`][-3]'), 0);
    ctx.assertJSONEqual(evalCode('[[]]'), [[]]);
    ctx.assertShallowEqual(evalCode('[[]][0]'), []);
    ctx.assertShallowEqual(evalCode('[0, []][1]'), []);
    ctx.assertJSONEqual(evalCode('[0, [1, 2]]'), [0, [1, 2]]);
    ctx.assertStrictEqual(evalCode('[0, [1, 2]][1][0]'), 1);
    ctx.assertJSONEqual(evalCode('[[0, 1], 2]'), [[0, 1], 2]);
    ctx.expectThrow(evalCode, TypeError, ['print[1]']);
    ctx.expectThrow(evalCode, TypeError, ['[0, 1]["2"]']);
    ctx.expectThrow(evalCode, RangeError, ['[0, 1][2]']);
    ctx.expectThrow(evalCode, RangeError, ['[0, 1][-3]']);

    ctx.assertShallowEqual(evalCode('Array.create()'), []);
    ctx.assertShallowEqual(evalCode('Array.create(0)'), []);
    ctx.assertShallowEqual(evalCode('Array.create(1)'), [null]);
    ctx.assertShallowEqual(evalCode('Array.create(2, 6)'), [6, 6]);
    ctx.expectThrow(evalCode, TypeError, [`Array.create('6')`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.create(-1)`]);

    ctx.assertShallowEqual(evalCode('Array.of()'), []);
    ctx.assertShallowEqual(evalCode('Array.of(2, 6)'), [2, 6]);
    ctx.assertJSONEqual(evalCode('Array.of([2, 6])'), [[2, 6]]);

    ctx.assertShallowEqual(evalCode('Array.clone([])'), []);
    ctx.assertShallowEqual(evalCode('Array.clone([0, 1])'), [0, 1]);
    ctx.expectThrow(evalCode, TypeError, [`Array.clone()`]);
    ctx.expectThrow(evalCode, TypeError, [`Array.clone(2)`]);

    ctx.assertShallowEqual(evalCode('[0, 1, 2] $a; Array.set(a, 0, 5); a'), [5, 1, 2]);
    ctx.assertShallowEqual(evalCode('[0, 1, 2] $a; Array.set(a, 2, 6); a'), [0, 1, 6]);
    ctx.expectThrow(evalCode, TypeError, [`Array.set('012')`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.set([0, 1], 2, 6)`]);

    ctx.assertShallowEqual(evalCode(`set('a', [0]); Array.push(a, 1); a`), [0, 1]);
    ctx.assertShallowEqual(evalCode(`set('a', []); Array.push(a, 0, 1); a`), [0, 1]);
    ctx.assertJSONEqual(evalCode(`set('a', []); Array.push(a, [0, 1]); a`), [[0, 1]]);
    ctx.expectThrow(evalCode, TypeError, [`Array.push(2, 6)`]);

    ctx.assertShallowEqual(evalCode(`set('a', [0]); Array.unshift(a, 1); a`), [1, 0]);
    ctx.assertShallowEqual(evalCode(`set('a', []); Array.unshift(a, 0, 1); a`), [1, 0]);
    ctx.assertJSONEqual(evalCode(`set('a', []); Array.unshift(a, [0, 1]); a`), [[0, 1]]);
    ctx.expectThrow(evalCode, TypeError, [`Array.unshift(2, 6)`]);

    ctx.assertStrictEqual(evalCode(`set('a', [0, 1, 2]); Array.pop(a)`), 2);
    ctx.assertShallowEqual(evalCode(`set('a', [0, 1, 2]); Array.pop(a); a`), [0, 1]);
    ctx.expectThrow(evalCode, TypeError, [`Array.pop('2')`]);

    ctx.assertStrictEqual(evalCode(`set('a', [0, 1, 2]); Array.shift(a)`), 0);
    ctx.assertShallowEqual(evalCode(`set('a', [0, 1, 2]); Array.shift(a); a`), [1, 2]);
    ctx.expectThrow(evalCode, TypeError, [`Array.shift('6')`]);

    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2])'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 0)'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1)'), [1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 2)'), [2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 3)'), []);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 0, 1)'), [0]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1, 3)'), [1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1, -1)'), [1]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1, -2)'), []);
    ctx.expectThrow(evalCode, TypeError, [`Array.slice('233')`]);
    ctx.expectThrow(evalCode, TypeError, [`Array.slice([0, 1, 2], '0')`]);
    ctx.expectThrow(evalCode, TypeError, [`Array.slice([0, 1, 2], 0, '1')`]);

    ctx.assertShallowEqual(evalCode('[0, 2] $a; Array.insert(a, 1, 1); a'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('[0, 2] $a; Array.insert(a, -1, 1); a'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('[0] $a; Array.insert(a, 1, 1, 2); a'), [0, 1, 2]);
    ctx.expectThrow(evalCode, TypeError, [`Array.insert('0')`]);
    ctx.expectThrow(evalCode, TypeError, [`Array.insert([])`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.insert([0, 1], 3, 2)`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.insert([0, 1], -3, -1)`]);

    ctx.assertShallowEqual(evalCode('[0, 1, 2] $a; Array.remove(a, 1); a'), [0, 2]);
    ctx.assertShallowEqual(evalCode('[0, 1, 2] $a; Array.remove(a, 0, 2); a'), [2]);
    ctx.assertShallowEqual(evalCode('[0, 1, 2] $a; Array.remove(a, 2); a'), [0, 1]);
    ctx.assertShallowEqual(evalCode('[0, 1, 2] $a; Array.remove(a, 1, 6); a'), [0]);
    ctx.expectThrow(evalCode, TypeError, [`Array.remove('0')`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.remove([0, 1], 3, 1)`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.remove([0, 1], -3, 1)`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.remove([0, 1], 0, -1)`]);

    ctx.assertShallowEqual(evalCode('Array.flat([])'), []);
    ctx.assertShallowEqual(evalCode('Array.flat([0, 1, 2])'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.flat([[0, 1], 2])'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.flat([[0], [1, 2]], 1)'), [0, 1, 2]);
    ctx.assertJSONEqual(evalCode('Array.flat([0, [[1], 2]])'), [0, [1], 2]);
    ctx.assertShallowEqual(evalCode('Array.flat([[[0]], [1, [2]]], 2)'), [0, 1, 2]);
    ctx.expectThrow(evalCode, TypeError, [`Array.flat('abc')`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.flat([0, 1, 2], 0)`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.flat([0, 1, 2], -1)`]);

    ctx.assertStrictEqual(evalCode(`Array.unpack([0, 1], ['a']); a`), 0);
    ctx.assertShallowEqual(evalCode(`Array.unpack([0, 1], ['a', 'b']); [a, b]`), [0, 1]);
    ctx.assertShallowEqual(evalCode(`Array.unpack([0], ['a', 'b'], true); [a, b]`), [0, null]);
    ctx.expectThrow(evalCode, TypeError, [`Array.unpack('xyz')`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.unpack([], ['a'])`]);
    ctx.expectThrow(evalCode, RangeError, [`Array.unpack([0], ['a', 'b'])`]);
    ctx.expectThrow(evalCode, TypeError, [`Array.unpack([0], 'a')`]);
    ctx.expectThrow(evalCode, TypeError, [`Array.unpack([0], ['a'], 1)`]);

    ctx.assertStrictEqual(evalCode(`Array.indexOf([0, '0', 0], 0)`), 0);
    ctx.assertStrictEqual(evalCode(`Array.indexOf([0, '0', 0], '0')`), 1);
    ctx.assertStrictEqual(evalCode(`Array.indexOf([0, '0', 0], 'a')`), -1);
    ctx.expectThrow(evalCode, TypeError, [`Array.indexOf('abc', 'a')`]);

    ctx.assertStrictEqual(evalCode(`Array.lastIndexOf([0, '0', 0], 0)`), 2);
    ctx.assertStrictEqual(evalCode(`Array.lastIndexOf([0, '0', 0], '0')`), 1);
    ctx.assertStrictEqual(evalCode(`Array.lastIndexOf([0, '0', 0], 'a')`), -1);
    ctx.expectThrow(evalCode, TypeError, [`Array.lastIndexOf('abc', 'a')`]);

    ctx.assertShallowEqual(evalCode(`Array.sort([0, 2, 1])`), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode(`Array.sort([0, 2, 1], @(#a, #b) { print(a, b); return(substraction(b, a)) })`), [2, 1, 0]);
    ctx.assertShallowEqual(evalCode(`Array.sort(['0', '2', '1'])`), ['0', '1', '2']);
    ctx.expectThrow(evalCode, TypeError, [`Array.sort('abc')`]);

};
