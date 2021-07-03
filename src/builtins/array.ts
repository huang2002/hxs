import { SymbolNode } from '3h-ast';
import { ContextValue, FunctionHandler, Utils } from '../common';
import { createFunctionHandler } from '../function';

export const builtinArray = Utils.createDict({

    create: Utils.injectHelp(
        'Array.create(size = 0, init = null)',
        createFunctionHandler(0, 2, (args, referer, context) => {
            if (args.length === 0) {
                return [];
            }
            const count = args[0];
            if (typeof count !== 'number') {
                Utils.raise(TypeError, 'expect a number as array size', referer, context);
            }
            if ((count as number) < 0 || !Number.isFinite(count)) {
                Utils.raise(RangeError, 'invalid array size', referer, context);
            }
            const init = args.length > 1 ? args[1] : null;
            return Array.from({ length: count as number }, _ => init);
        })
    ),

    clone: Utils.injectHelp(
        'Array.clone(array)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to clone', referer, context);
            }
            return (array as ContextValue[]).slice();
        })
    ),

    sizeOf: Utils.injectHelp(
        'Array.sizeOf(array)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array', referer, context);
            }
            return (array as ContextValue[]).length;
        })
    ),

    set: Utils.injectHelp(
        'Array.set(array, index, value)',
        createFunctionHandler(3, 3, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to modify', referer, context);
            }
            const index = args[1];
            if (typeof index !== 'number') {
                Utils.raise(TypeError, 'expect a number as index', referer, context);
            }
            const arraySize = (array as ContextValue[]).length;
            const normalizedIndex = (index as number) < 0
                ? arraySize + (index as number)
                : (index as number);
            if (normalizedIndex >= arraySize || normalizedIndex < 0) {
                const message = `index(${index}) out of range(array size: ${arraySize})`;
                Utils.raise(RangeError, message, referer, context);
            }
            (array as ContextValue[])[normalizedIndex] = args[2];
            return null;
        })
    ),

    push: Utils.injectHelp(
        'Array.push(array, data...)',
        createFunctionHandler(2, Infinity, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to modify', referer, context);
            }
            for (let i = 1; i < args.length; i++) {
                (array as ContextValue[]).push(args[i]);
            }
            return null;
        })
    ),

    unshift: Utils.injectHelp(
        'Array.unshift(array, data...)',
        createFunctionHandler(2, Infinity, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to modify', referer, context);
            }
            for (let i = 1; i < args.length; i++) {
                (array as ContextValue[]).unshift(args[i]);
            }
            return null;
        })
    ),

    pop: Utils.injectHelp(
        'Array.pop(array)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to modify', referer, context);
            }
            return (
                (array as ContextValue[]).length
                    ? (array as ContextValue[]).pop()!
                    : null
            );
        })
    ),

    shift: Utils.injectHelp(
        'Array.shift(array)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to modify', referer, context);
            }
            return (
                (array as ContextValue[]).length
                    ? (array as ContextValue[]).shift()!
                    : null
            );
        })
    ),

    slice: Utils.injectHelp(
        'Array.slice(array, start = 0, end = Array.sizeOf(array))',
        createFunctionHandler(1, 3, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array as source', referer, context);
            }
            if (args.length > 1) {
                if (typeof args[1] !== 'number') {
                    Utils.raise(TypeError, 'expect a number as begin index', referer, context);
                }
                if (args.length > 2) {
                    if (typeof args[2] !== 'number') {
                        Utils.raise(TypeError, 'expect a number as end index', referer, context);
                    }
                }
            }
            return (array as ContextValue[]).slice(
                args[1] as number | undefined,
                args[2] as number | undefined,
            );
        })
    ),

    insert: Utils.injectHelp(
        'Array.insert(array, index, data...)',
        createFunctionHandler(3, Infinity, (args, referer, context) => {

            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to operate on', referer, context);
            }

            const index = args[1];
            if (typeof index !== 'number') {
                Utils.raise(TypeError, 'expect a number as start index', referer, context);
            }

            const arraySize = (array as ContextValue[]).length;
            const normalizedIndex = (index as number) < 0
                ? arraySize + (index as number)
                : (index as number);

            if (normalizedIndex > arraySize || normalizedIndex < 0) {
                const message = `index(${index}) out of range(array size: ${arraySize})`;
                Utils.raise(RangeError, message, referer, context);
            }

            const insertCount = args.length - 2;
            (array as ContextValue[]).length += insertCount;

            // move subsequent elements
            for (let i = arraySize - 1; i >= normalizedIndex; i--) {
                (array as ContextValue[])[i + insertCount] = (array as ContextValue[])[i];
            }

            // insert new elements
            for (let i = 2; i < args.length; i++) {
                (array as ContextValue[])[normalizedIndex + i - 2] = args[i];
            }

            return null;

        })
    ),

    remove: Utils.injectHelp(
        'Array.remove(array, index, count = 1)',
        createFunctionHandler(2, 3, (args, referer, context) => {

            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array as the first argument', referer, context);
            }

            const index = args[1];
            if (typeof index !== 'number') {
                Utils.raise(TypeError, 'expect a number as start index', referer, context);
            }

            const arraySize = (array as ContextValue[]).length;
            const normalizedIndex = (index as number) < 0 ?
                arraySize + (index as number)
                : (index as number);

            if (normalizedIndex > arraySize || normalizedIndex < 0) {
                const message = `index(${index}) out of range(array size: ${arraySize})`;
                Utils.raise(RangeError, message, referer, context);
            }

            if (args.length === 3) {
                if (typeof args[2] !== 'number') {
                    Utils.raise(TypeError, 'expect a number as removing count', referer, context);
                }
                if (args[2] as number < 0 || args[2] !== args[2]) {
                    Utils.raise(RangeError, 'invalid removing count', referer, context);
                }
            }

            const count = args.length === 3 ? args[2] as number : 1;

            if (count === 0) {
                return null;
            }

            if (normalizedIndex + count >= arraySize) {
                (array as ContextValue[]).length = normalizedIndex;
            } else {
                // move trailing elements
                for (let i = normalizedIndex; i < arraySize - count; i++) {
                    (array as ContextValue[])[i] = (array as ContextValue[])[i + count];
                }
                (array as ContextValue[]).length -= count;
            }

            return null;

        })
    ),

    clear: Utils.injectHelp(
        'Array.clear(array)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to operate on', referer, context);
            }
            (array as ContextValue[]).length = 0;
            return null;
        })
    ),

    flat: Utils.injectHelp(
        'Array.flat(arrays, depth = 1)',
        createFunctionHandler(1, 2, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to flat', referer, context);
            }
            const depth = (args.length === 2) ? args[1] : 1;
            if (typeof depth !== 'number') {
                Utils.raise(TypeError, 'expect a number as depth', referer, context);
            }
            if ((depth as number) <= 0 || depth !== depth) {
                Utils.raise(RangeError, 'invalid depth', referer, context);
            }
            return (array as ContextValue[]).flat(depth as number);
        })
    ),

    unpack: Utils.injectHelp(
        'Array.unpack(array, names, loose = false)',
        createFunctionHandler(2, 3, (args, referer, context) => {

            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to unpack', referer, context);
            }

            const names = args[1];
            if (!Array.isArray(names)) {
                Utils.raise(TypeError, 'expect an array of strings as variable names', referer, context);
            }

            const nameCount = (names as string[]).length;
            const arraySize = (array as ContextValue[]).length;

            for (let i = 0; i < nameCount; i++) {
                if (typeof (names as string[])[i] !== 'string') {
                    Utils.raise(TypeError, 'expect strings as variable names', referer, context);
                }
            }

            const loose = args.length === 3 && args[2];
            if (typeof loose !== 'boolean') {
                Utils.raise(TypeError, 'expect a boolean as loose option', referer, context);
            }

            const { store } = context;
            if (loose) {
                if (nameCount > arraySize) {
                    for (let i = 0; i < arraySize; i++) {
                        store.set((names as string[])[i], (array as ContextValue[])[i]);
                    }
                    for (let i = arraySize; i < nameCount; i++) {
                        store.set((names as string[])[i], null);
                    }
                } else {
                    for (let i = 0; i < nameCount; i++) {
                        store.set((names as string[])[i], (array as ContextValue[])[i]);
                    }
                }
            } else {
                if (nameCount > arraySize) {
                    Utils.raise(RangeError, 'not enough values in the given array', referer, context);
                }
                for (let i = 0; i < nameCount; i++) {
                    store.set((names as string[])[i], (array as ContextValue[])[i]);
                }
            }

            return null;

        })
    ),

    indexOf: Utils.injectHelp(
        'Array.indexOf(array, value)',
        createFunctionHandler(2, 2, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to search in', referer, context);
            }
            return (array as ContextValue[]).indexOf(args[1]);
        })
    ),

    lastIndexOf: Utils.injectHelp(
        'Array.lastIndexOf(array, value)',
        createFunctionHandler(2, 2, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to search in', referer, context);
            }
            return (array as ContextValue[]).lastIndexOf(args[1]);
        })
    ),

    includes: Utils.injectHelp(
        'Array.includes(array, value)',
        createFunctionHandler(2, 2, (args, referer, context) => {
            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array to check', referer, context);
            }
            return (array as ContextValue[]).includes(args[1]);
        })
    ),

    sort: Utils.injectHelp(
        'Array.sort(array, compareFn?)',
        createFunctionHandler(1, 2, (args, referer, context) => {

            const array = args[0];
            if (!Array.isArray(array)) {
                Utils.raise(TypeError, 'expect an array as the first argument', referer, context);
            }

            const compareFn = args[1];
            if (args.length > 1 && typeof compareFn !== 'function') {
                Utils.raise(TypeError, 'expect a function as the second argument', referer, context);
            }

            let _compareFn;
            if (compareFn) {
                _compareFn = (a: ContextValue, b: ContextValue) => {
                    const COMMA_NODE: SymbolNode = {
                        type: 'symbol',
                        value: ',',
                        line: referer.line,
                        column: referer.column,
                        offset: referer.offset,
                    };
                    return (compareFn as FunctionHandler<number>)(
                        [
                            Utils.createValueNode(a, referer),
                            COMMA_NODE,
                            Utils.createValueNode(b, referer),
                        ],
                        referer,
                        context,
                    );
                };
            }

            return (array as ContextValue[]).sort(_compareFn);

        })
    ),

});
