// @ts-check
const { evalCode } = require('../../dist/hxs.umd.js');

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertDeepEqual(evalCode(`[0, [1, 2], [3]]`), [0, [1, 2], [3]]);

    ctx.assertStrictEqual(evalCode(`[0, [1]][0]`), 0);
    ctx.assertDeepEqual(evalCode(`[0, [1]][1]`), [1]);
    ctx.assertDeepEqual(evalCode(`[0, [1]][-1]`), [1]);
    ctx.assertStrictEqual(evalCode(`[0, [1]][-2]`), 0);
    ctx.expectThrow(TypeError, evalCode, [`[0, [1]]['0']`]);
    ctx.expectThrow(RangeError, evalCode, [`[0, [1]][2]`]);
    ctx.expectThrow(RangeError, evalCode, [`[0, [1]][-3]`]);

    ctx.assertShallowEqual(evalCode('Array.create()'), []);
    ctx.assertShallowEqual(evalCode('Array.create(0)'), []);
    ctx.assertShallowEqual(evalCode('Array.create(1)'), [null]);
    ctx.assertShallowEqual(evalCode('Array.create(2, 6)'), [6, 6]);
    ctx.expectThrow(TypeError, evalCode, [`Array.create('6')`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.create(-1)`]);

    ctx.assertShallowEqual(evalCode('Array.clone([])'), []);
    ctx.assertShallowEqual(evalCode('Array.clone([0, 1])'), [0, 1]);
    ctx.expectThrow(TypeError, evalCode, [`Array.clone()`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.clone(2)`]);

    ctx.assertShallowEqual(evalCode('Array.sizeOf([])'), 0);
    ctx.assertShallowEqual(evalCode('Array.sizeOf([0, 1])'), 2);
    ctx.expectThrow(TypeError, evalCode, [`Array.sizeOf('abc')`]);

    ctx.assertShallowEqual(evalCode('a = [0, 1, 2]; Array.set(a, 0, 5); a'), [5, 1, 2]);
    ctx.assertShallowEqual(evalCode('a = [0, 1, 2]; Array.set(a, 2, 6); a'), [0, 1, 6]);
    ctx.expectThrow(TypeError, evalCode, [`Array.set('012')`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.set([0, 1], 2, 6)`]);

    ctx.assertShallowEqual(evalCode(`a = [0]; Array.push(a, 1); a`), [0, 1]);
    ctx.assertShallowEqual(evalCode(`a = []; Array.push(a, 0, 1); a`), [0, 1]);
    ctx.assertJSONEqual(evalCode(`a = []; Array.push(a, [0, 1]); a`), [[0, 1]]);
    ctx.expectThrow(TypeError, evalCode, [`Array.push(2, 6)`]);

    ctx.assertShallowEqual(evalCode(`a = [0]; Array.unshift(a, 1); a`), [1, 0]);
    ctx.assertShallowEqual(evalCode(`a = []; Array.unshift(a, 0, 1); a`), [1, 0]);
    ctx.assertJSONEqual(evalCode(`a = []; Array.unshift(a, [0, 1]); a`), [[0, 1]]);
    ctx.expectThrow(TypeError, evalCode, [`Array.unshift(2, 6)`]);

    ctx.assertStrictEqual(evalCode(`a = [0, 1, 2]; Array.pop(a)`), 2);
    ctx.assertShallowEqual(evalCode(`a = [0, 1, 2]; Array.pop(a); a`), [0, 1]);
    ctx.expectThrow(TypeError, evalCode, [`Array.pop('2')`]);

    ctx.assertStrictEqual(evalCode(`a = [0, 1, 2]; Array.shift(a)`), 0);
    ctx.assertShallowEqual(evalCode(`a = [0, 1, 2]; Array.shift(a); a`), [1, 2]);
    ctx.expectThrow(TypeError, evalCode, [`Array.shift('6')`]);

    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2])'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 0)'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1)'), [1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 2)'), [2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 3)'), []);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 0, 1)'), [0]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1, 3)'), [1, 2]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1, -1)'), [1]);
    ctx.assertShallowEqual(evalCode('Array.slice([0, 1, 2], 1, -2)'), []);
    ctx.expectThrow(TypeError, evalCode, [`Array.slice('233')`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.slice([0, 1, 2], '0')`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.slice([0, 1, 2], 0, '1')`]);

    ctx.assertShallowEqual(evalCode('a = [0, 2]; Array.insert(a, 1, 1); a'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('a = [0, 2]; Array.insert(a, -1, 1); a'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('a = [0]; Array.insert(a, 1, 1, 2); a'), [0, 1, 2]);
    ctx.expectThrow(TypeError, evalCode, [`Array.insert('0')`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.insert([])`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.insert([0, 1], 3, 2)`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.insert([0, 1], -3, -1)`]);

    ctx.assertShallowEqual(evalCode('a = [0, 1, 2]; Array.remove(a, 1); a'), [0, 2]);
    ctx.assertShallowEqual(evalCode('a = [0, 1, 2]; Array.remove(a, 0, 2); a'), [2]);
    ctx.assertShallowEqual(evalCode('a = [0, 1, 2]; Array.remove(a, 2); a'), [0, 1]);
    ctx.assertShallowEqual(evalCode('a = [0, 1, 2]; Array.remove(a, 1, 6); a'), [0]);
    ctx.expectThrow(TypeError, evalCode, [`Array.remove('0')`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.remove([0, 1], 3, 1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.remove([0, 1], -3, 1)`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.remove([0, 1], 0, -1)`]);

    ctx.assertShallowEqual(evalCode('a = [0, 1, 2]; Array.clear(a); a'), []);
    ctx.assertShallowEqual(evalCode('a = []; Array.clear(a); a'), []);
    ctx.expectThrow(TypeError, evalCode, [`Array.clear('abc')`]);

    ctx.assertShallowEqual(evalCode('Array.flat([])'), []);
    ctx.assertShallowEqual(evalCode('Array.flat([0, 1, 2])'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.flat([[0, 1], 2])'), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode('Array.flat([[0], [1, 2]], 1)'), [0, 1, 2]);
    ctx.assertJSONEqual(evalCode('Array.flat([0, [[1], 2]])'), [0, [1], 2]);
    ctx.assertShallowEqual(evalCode('Array.flat([[[0]], [1, [2]]], 2)'), [0, 1, 2]);
    ctx.expectThrow(TypeError, evalCode, [`Array.flat('abc')`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.flat([0, 1, 2], 0)`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.flat([0, 1, 2], -1)`]);

    ctx.assertStrictEqual(evalCode(`Array.unpack([0, 1], [#a]); a`), 0);
    ctx.assertShallowEqual(evalCode(`Array.unpack([0, 1], [#a, #b]); [a, b]`), [0, 1]);
    ctx.assertShallowEqual(evalCode(`Array.unpack([0], [#a, #b], true); [a, b]`), [0, null]);
    ctx.expectThrow(TypeError, evalCode, [`Array.unpack('xyz')`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.unpack([], [#a])`]);
    ctx.expectThrow(RangeError, evalCode, [`Array.unpack([0], [#a, #b])`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.unpack([0], #a)`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.unpack([0], [#a], 1)`]);

    ctx.assertStrictEqual(evalCode(`Array.indexOf([0, '0', 0], 0)`), 0);
    ctx.assertStrictEqual(evalCode(`Array.indexOf([0, '0', 0], '0')`), 1);
    ctx.assertStrictEqual(evalCode(`Array.indexOf([0, '0', 0], 'a')`), -1);
    ctx.expectThrow(TypeError, evalCode, [`Array.indexOf('abc', 'a')`]);

    ctx.assertStrictEqual(evalCode(`Array.lastIndexOf([0, '0', 0], 0)`), 2);
    ctx.assertStrictEqual(evalCode(`Array.lastIndexOf([0, '0', 0], '0')`), 1);
    ctx.assertStrictEqual(evalCode(`Array.lastIndexOf([0, '0', 0], 'a')`), -1);
    ctx.expectThrow(TypeError, evalCode, [`Array.lastIndexOf('abc', 'a')`]);

    ctx.assertStrictEqual(evalCode(`Array.includes([0, '0', 0], 0)`), true);
    ctx.assertStrictEqual(evalCode(`Array.includes([0, '0', 0], '0')`), true);
    ctx.assertStrictEqual(evalCode(`Array.includes([0, '0', 0], 'a')`), false);
    ctx.expectThrow(TypeError, evalCode, [`Array.includes('abc', 'a')`]);

    ctx.assertShallowEqual(evalCode(`Array.sort([0, 2, 1])`), [0, 1, 2]);
    ctx.assertShallowEqual(evalCode(`Array.sort([0, 2, 1], @(a, b) { return(b - a) })`), [2, 1, 0]);
    ctx.assertShallowEqual(evalCode(`Array.sort([0, 2, 1], { #__invoke -> @(a, b) { return(b - a) } })`), [2, 1, 0]);
    ctx.assertShallowEqual(evalCode(`Array.sort(['0', '2', '1'])`), ['0', '1', '2']);
    ctx.expectThrow(TypeError, evalCode, [`Array.sort('abc')`]);

    ctx.assertShallowEqual(evalCode(`a = [1, 2, 3]; Array.forEach(a, @(x, i) { Array.set(a, i, x + i) }); a`), [1, 3, 5]);
    ctx.assertShallowEqual(evalCode(`a = [1, 2, 3]; Array.forEach(a, { #__invoke -> @(x, i) { Array.set(a, i, x + i) } }); a`), [1, 3, 5]);
    ctx.expectThrow(TypeError, evalCode, [`Array.forEach('abc', @() {})`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.forEach([], null)`]);

    ctx.assertShallowEqual(evalCode(`a = [1, 2, 3]; Array.map(a, @(x, i) { return(x + i) })`), [1, 3, 5]);
    ctx.assertShallowEqual(evalCode(`a = [1, 2, 3]; Array.map(a, { #__invoke -> @(x, i) { return(x + i) } }); a`), [1, 2, 3]);
    ctx.expectThrow(TypeError, evalCode, [`Array.map('abc', @() {})`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.map([], null)`]);

    ctx.assertShallowEqual(evalCode(`a = [1, 2, 3]; Array.filter(a, @(x, i) { return(x & 1) })`), [1, 3]);
    ctx.assertShallowEqual(evalCode(`a = [1, 2, 3]; Array.filter(a, { #__invoke -> @(x, i) { return(x & 1) } }); a`), [1, 2, 3]);
    ctx.expectThrow(TypeError, evalCode, [`Array.filter('abc', @() {})`]);
    ctx.expectThrow(TypeError, evalCode, [`Array.filter([], null)`]);

    ctx.assertDeepEqual(evalCode(`[...[0, 1], 2, ...[[3]]]`), [0, 1, 2, [3]]);
    ctx.expectThrow(TypeError, evalCode, [`[...'abc']`]);

};
