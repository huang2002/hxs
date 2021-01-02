import { Common } from '../common';
import { evalList } from '../eval';

export const BuiltinArray = Common.createDict({

    // Array.create(size?, init=null)
    create(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.create', 0, 2);
        if (args.length === 0) {
            return [];
        }
        if (typeof args[0] !== 'number') {
            throw new TypeError(
                `expect a number as array size (file ${fileName} line ${line})`
            );
        }
        if (args[0] < 0 || !Number.isFinite(args[0])) {
            throw new RangeError(
                `invalid array size (file ${fileName} line ${line})`
            );
        }
        const init = args.length > 1 ? args[1] : null;
        return Array.from({ length: args[0] }, _ => init);
    },

    // Array.of(data...)
    of(rawArgs, context, fileName) {
        return rawArgs.length ? evalList(rawArgs, context, fileName) : [];
    },

    // Array.clone(array)
    clone(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.clone', 1, 1);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        return array.slice();
    },

    // Array.set(array, index, value)
    set(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.set', 3, 3);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        const index = args[1];
        if (typeof index !== 'number') {
            throw new TypeError(
                `expect a number as start index (file ${fileName} line ${line})`
            );
        }
        const normalizedIndex = index < 0
            ? array.length + index
            : index;
        if (normalizedIndex >= array.length || normalizedIndex < 0) {
            throw new RangeError(
                `index(${index}) out of range (file ${fileName} line ${line})`
            );
        }
        array[normalizedIndex] = args[2];
    },

    // Array.push(array, data...)
    push(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.push', 2, Infinity);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        for (let i = 1; i < args.length; i++) {
            array.push(args[i]);
        }
    },

    // Array.unshift(array, data...)
    unshift(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.unshift', 2, Infinity);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        for (let i = 1; i < args.length; i++) {
            array.unshift(args[i]);
        }
    },

    // Array.pop(array)
    pop(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.pop', 1, 1);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        return array.pop();
    },

    // Array.shift(array)
    shift(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.shift', 1, 1);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        return array.shift();
    },

    // Array.slice(array, start?, end?)
    slice(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.slice', 1, 3);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        if (args.length > 1) {
            if (typeof args[1] !== 'number') {
                throw new TypeError(
                    `expect a number as start index (file ${fileName} line ${line})`
                );
            }
            if (args.length > 2) {
                if (typeof args[2] !== 'number') {
                    throw new TypeError(
                        `expect a number as end index (file ${fileName} line ${line})`
                    );
                }
            }
        }
        return array.slice(
            args[1] as number | undefined,
            args[2] as number | undefined
        );
    },

    // Array.insert(array, index, data...)
    insert(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.insert', 3, Infinity);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        const index = args[1];
        if (typeof index !== 'number') {
            throw new TypeError(
                `expect a number as start index (file ${fileName} line ${line})`
            );
        }
        const normalizedIndex = index < 0
            ? array.length + index
            : index;
        if (normalizedIndex > array.length || normalizedIndex < 0) {
            throw new RangeError(
                `index(${index}) out of range (file ${fileName} line ${line})`
            );
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
    remove(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.remove', 2, 3);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        const index = args[1];
        if (typeof index !== 'number') {
            throw new TypeError(
                `expect a number as start index (file ${fileName} line ${line})`
            );
        }
        const arraySize = array.length;
        const normalizedIndex = index < 0 ? arraySize + index : index;
        if (normalizedIndex > arraySize || normalizedIndex < 0) {
            throw new RangeError(
                `index(${index}) out of range (file ${fileName} line ${line})`
            );
        }
        if (args.length === 3) {
            if (typeof args[2] !== 'number') {
                throw new TypeError(
                    `expect a number as removing count (file ${fileName} line ${line})`
                );
            }
            if (args[2] < 0 || args[2] !== args[2]) {
                throw new RangeError(
                    `invalid removing count (file ${fileName} line ${line})`
                );
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
    flat(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.flat', 1, 2);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array of arrays as the first argument (file ${fileName} line ${line})`
            );
        }
        const depth = args.length === 2 ? args[1] : 1;
        if (typeof depth !== 'number') {
            throw new TypeError(
                `expect a number as depth (file ${fileName} line ${line})`
            );
        }
        if (depth <= 0 || depth !== depth) {
            throw new RangeError(
                `invalid depth (file ${fileName} line ${line})`
            );
        }
        return array.flat(depth);
    },

    // Array.unpack(array, names, loose?)
    unpack(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Array.unpack', 2, 3);
        const array = args[0];
        if (!Array.isArray(array)) {
            throw new TypeError(
                `expect an array as the first argument (file ${fileName} line ${line})`
            );
        }
        const names = args[1] as readonly string[];
        if (!Array.isArray(names)) {
            throw new TypeError(
                `expect an array of strings as variable names (file ${fileName} line ${line})`
            );
        }
        for (let i = 0; i < names.length; i++) {
            if (typeof names[i] !== 'string') {
                throw new TypeError(
                    `expect strings as variable names (file ${fileName} line ${line})`
                );
            }
        }
        const loose = args.length === 3 && args[2];
        if (typeof loose !== 'boolean') {
            throw new TypeError(
                `expect a boolean as loose option (file ${fileName} line ${line})`
            );
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
                throw new RangeError(
                    `not enough values in the given array (file ${fileName} line ${line})`
                );
            }
            for (let i = 0; i < names.length; i++) {
                context.set(names[i], array[i]);
            }
        }
    },

});
