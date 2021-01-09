import { Common } from '../common';
import { evalList } from '../eval';

export const BuiltinArray = Common.createDict({

    // Array.create(size?, init=null)
    create(rawArgs, context, env) {
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
    },

    // Array.of(data...)
    of(rawArgs, context, env) {
        return rawArgs.length ? evalList(rawArgs, context, env.fileName) : [];
    },

    // Array.clone(array)
    clone(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Array.clone', 1, 1);
        const array = args[0];
        if (!Array.isArray(array)) {
            Common.raise(TypeError, `expect an array as the first argument`, env);
        }
        return (array as unknown[]).slice();
    },

    // Array.set(array, index, value)
    set(rawArgs, context, env) {
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
    },

    // Array.push(array, data...)
    push(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Array.push', 2, Infinity);
        const array = args[0] as unknown[];
        if (!Array.isArray(array)) {
            Common.raise(TypeError, `expect an array as the first argument`, env);
        }
        for (let i = 1; i < args.length; i++) {
            array.push(args[i]);
        }
    },

    // Array.unshift(array, data...)
    unshift(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Array.unshift', 2, Infinity);
        const array = args[0] as unknown[];
        if (!Array.isArray(array)) {
            Common.raise(TypeError, `expect an array as the first argument`, env);
        }
        for (let i = 1; i < args.length; i++) {
            array.unshift(args[i]);
        }
    },

    // Array.pop(array)
    pop(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Array.pop', 1, 1);
        const array = args[0] as unknown[];
        if (!Array.isArray(array)) {
            Common.raise(TypeError, `expect an array as the first argument`, env);
        }
        return array.pop();
    },

    // Array.shift(array)
    shift(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Array.shift', 1, 1);
        const array = args[0] as unknown[];
        if (!Array.isArray(array)) {
            Common.raise(TypeError, `expect an array as the first argument`, env);
        }
        return array.shift();
    },

    // Array.slice(array, start?, end?)
    slice(rawArgs, context, env) {
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
    },

    // Array.insert(array, index, data...)
    insert(rawArgs, context, env) {
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
    },

    // Array.remove(array, index, count?)
    remove(rawArgs, context, env) {
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
    },

    // Array.flat(arrays, depth?)
    flat(rawArgs, context, env) {
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
    },

    // Array.unpack(array, names, loose?)
    unpack(rawArgs, context, env) {
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
    },

});
