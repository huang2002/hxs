import { Common, EvalContextValue } from '../common';
import { evalList } from '../eval';
import { RuleHandler } from '../rules/rule';

export const BuiltinArray = Common.createDict({

    create: Common.injectHelp(
        'Array.create(size?, init=null)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.create', 0, 2);
            if (args.length === 0) {
                return [];
            }
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as array size`, env);
            }
            if (args[0] as number < 0 || !Number.isFinite(args[0])) {
                Common.raise(RangeError, `invalid array size`, env);
            }
            const init = args.length > 1 ? args[1] : null;
            return Array.from({ length: args[0] as number }, _ => init);
        }
    ),

    of: Common.injectHelp(
        'Array.of(data...)',
        (rawArgs, context, env) => {
            return rawArgs.length ? evalList(rawArgs, context, env.fileName) : [];
        }
    ),

    clone: Common.injectHelp(
        'Array.clone(array)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.clone', 1, 1);
            const array = args[0];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            return (array as EvalContextValue[]).slice();
        }
    ),

    sizeOf: Common.injectHelp(
        'Array.sizeOf(array)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.sizeOf', 1, 1);
            const array = args[0];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            return (array as unknown[]).length;
        }
    ),

    set: Common.injectHelp(
        'Array.set(array, index, value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.set', 3, 3);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            const index = args[1] as number;
            if (typeof index !== 'number') {
                Common.raise(TypeError, `expect a number as start index`, env);
            }
            const normalizedIndex = index < 0
                ? array.length + index
                : index;
            if (normalizedIndex >= array.length || normalizedIndex < 0) {
                Common.raise(RangeError, `index(${index}) out of range`, env);
            }
            array[normalizedIndex] = args[2];
        }
    ),

    push: Common.injectHelp(
        'Array.push(array, data...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.push', 2, Infinity);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            for (let i = 1; i < args.length; i++) {
                array.push(args[i]);
            }
        }
    ),

    unshift: Common.injectHelp(
        'Array.unshift(array, data...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.unshift', 2, Infinity);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            for (let i = 1; i < args.length; i++) {
                array.unshift(args[i]);
            }
        }
    ),

    pop: Common.injectHelp(
        'Array.pop(array)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.pop', 1, 1);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            return array.pop();
        }
    ),

    shift: Common.injectHelp(
        'Array.shift(array)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.shift', 1, 1);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            return array.shift();
        }
    ),

    slice: Common.injectHelp(
        'Array.slice(array, start?, end?)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.slice', 1, 3);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            if (args.length > 1) {
                if (typeof args[1] !== 'number') {
                    Common.raise(TypeError, `expect a number as start index`, env);
                }
                if (args.length > 2) {
                    if (typeof args[2] !== 'number') {
                        Common.raise(TypeError, `expect a number as end index`, env);
                    }
                }
            }
            return array.slice(
                args[1] as number | undefined,
                args[2] as number | undefined
            );
        }
    ),

    insert: Common.injectHelp(
        'Array.insert(array, index, data...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.insert', 3, Infinity);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            const index = args[1] as number;
            if (typeof index !== 'number') {
                Common.raise(TypeError, `expect a number as start index`, env);
            }
            const normalizedIndex = index < 0
                ? array.length + index
                : index;
            if (normalizedIndex > array.length || normalizedIndex < 0) {
                Common.raise(RangeError, `index(${index}) out of range`, env);
            }
            const insertCount = args.length - 2;
            const subsequentCount = array.length - normalizedIndex;
            array.length += insertCount;
            for (let i = subsequentCount - 1; i >= 0; i--) {
                array[normalizedIndex + i + insertCount] = array[normalizedIndex + i];
            }
            for (let i = 2; i < args.length; i++) {
                array[normalizedIndex + i - 2] = args[i];
            }
        }
    ),

    remove: Common.injectHelp(
        'Array.remove(array, index, count?)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.remove', 2, 3);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            const index = args[1] as number;
            if (typeof index !== 'number') {
                Common.raise(TypeError, `expect a number as start index`, env);
            }
            const arraySize = array.length;
            const normalizedIndex = index < 0 ? arraySize + index : index;
            if (normalizedIndex > arraySize || normalizedIndex < 0) {
                Common.raise(RangeError, `index(${index}) out of range`, env);
            }
            if (args.length === 3) {
                if (typeof args[2] !== 'number') {
                    Common.raise(TypeError, `expect a number as removing count`, env);
                }
                if (args[2] as number < 0 || args[2] !== args[2]) {
                    Common.raise(RangeError, `invalid removing count`, env);
                }
            }
            const count = args.length === 3 ? args[2] as number : 1;
            if (count === 0) {
                return;
            }
            if (normalizedIndex + count >= arraySize) {
                array.length = normalizedIndex;
            } else {
                const trailingCount = arraySize - normalizedIndex - count;
                for (let i = 0; i < trailingCount; i++) {
                    array[normalizedIndex + i] = array[arraySize - trailingCount + i];
                }
                array.length -= count;
            }
        }
    ),

    clear: Common.injectHelp(
        'Array.clear(array)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.clear', 1, 1);
            const array = args[0];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            (array as unknown[]).length = 0;
        }
    ),

    flat: Common.injectHelp(
        'Array.flat(arrays, depth=1)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.flat', 1, 2);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array of arrays as the first argument`, env);
            }
            const depth = args.length === 2 ? args[1] as number : 1;
            if (typeof depth !== 'number') {
                Common.raise(TypeError, `expect a number as depth`, env);
            }
            if (depth <= 0 || depth !== depth) {
                Common.raise(RangeError, `invalid depth`, env);
            }
            return array.flat(depth);
        }
    ),

    unpack: Common.injectHelp(
        'Array.unpack(array, names, loose=false)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.unpack', 2, 3);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            const names = args[1] as readonly string[];
            if (!Array.isArray(names)) {
                Common.raise(TypeError, `expect an array of strings as variable names`, env);
            }
            for (let i = 0; i < names.length; i++) {
                if (typeof names[i] !== 'string') {
                    Common.raise(TypeError, `expect strings as variable names`, env);
                }
            }
            const loose = args.length === 3 && args[2];
            if (typeof loose !== 'boolean') {
                Common.raise(TypeError, `expect a boolean as loose option`, env);
            }
            if (loose) {
                if (names.length > array.length) {
                    for (let i = 0; i < array.length; i++) {
                        context.set(names[i], array[i]);
                    }
                    for (let i = array.length; i < names.length; i++) {
                        context.set(names[i], null);
                    }
                } else {
                    for (let i = 0; i < names.length; i++) {
                        context.set(names[i], array[i]);
                    }
                }
            } else {
                if (names.length > array.length) {
                    Common.raise(RangeError, `not enough values in the given array`, env);
                }
                for (let i = 0; i < names.length; i++) {
                    context.set(names[i], array[i]);
                }
            }
        }
    ),

    indexOf: Common.injectHelp(
        'Array.indexOf(array, value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.indexOf', 2, 2);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            return array.indexOf(args[1]);
        }
    ),

    lastIndexOf: Common.injectHelp(
        'Array.lastIndexOf(array, value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.lastIndexOf', 2, 2);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            return array.lastIndexOf(args[1]);
        }
    ),

    includes: Common.injectHelp(
        'Array.includes(array, value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.includes', 2, 2);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            return array.includes(args[1]);
        }
    ),

    sort: Common.injectHelp(
        'Array.sort(array, compareFn?)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'Array.sort', 1, 2);
            const array = args[0] as unknown[];
            if (!Array.isArray(array)) {
                Common.raise(TypeError, `expect an array as the first argument`, env);
            }
            const compareFn = args[1] as undefined | ((...args: Parameters<RuleHandler>) => number);
            if (compareFn !== undefined && typeof compareFn !== 'function') {
                Common.raise(TypeError, `expect a function as the second argument`, env);
            }
            return array.sort(compareFn && ((a, b) => (
                compareFn(
                    [{
                        type: 'value',
                        value: a,
                        line: env.line,
                        offset: NaN,
                        column: NaN,
                    }, {
                        type: 'symbol',
                        value: ',',
                        line: env.line,
                        offset: NaN,
                        column: NaN,
                    }, {
                        type: 'value',
                        value: b,
                        line: env.line,
                        offset: NaN,
                        column: NaN,
                    }],
                    context,
                    env
                )
            )));
        }
    ),

});
