import { ContextValue, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { invoke, isInvocable } from '../function/common';

export const builtinArray = Utils.injectHelp(
    'A dict providing methods for array manipulations.',
    Utils.createDict({

        __invoke: Utils.injectHelp(
            'Array.__invoke(data...)',
            createFunctionHandler(0, Infinity, (args) => (
                args.slice()
            ))
        ),

        create: Utils.injectHelp(
            'Array.create(size = 0, init = null)',
            createFunctionHandler(0, 2, (args, referrer, context) => {
                if (args.length === 0) {
                    return [];
                }
                const count = args[0];
                if (typeof count !== 'number') {
                    Utils.raise(TypeError, 'expect a number as array size', referrer, context);
                }
                if ((count as number) < 0 || !Number.isFinite(count)) {
                    Utils.raise(RangeError, 'invalid array size', referrer, context);
                }
                const init = args.length > 1 ? args[1] : null;
                return Array.from({ length: count as number }, _ => init);
            })
        ),

        clone: Utils.injectHelp(
            'Array.clone(array)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to clone', referrer, context);
                }
                return (array as ContextValue[]).slice();
            })
        ),

        sizeOf: Utils.injectHelp(
            'Array.sizeOf(array)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array', referrer, context);
                }
                return (array as ContextValue[]).length;
            })
        ),

        push: Utils.injectHelp(
            'Array.push(array, data...)',
            createFunctionHandler(2, Infinity, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to modify', referrer, context);
                }
                for (let i = 1; i < args.length; i++) {
                    (array as ContextValue[]).push(args[i]);
                }
                return null;
            })
        ),

        unshift: Utils.injectHelp(
            'Array.unshift(array, data...)',
            createFunctionHandler(2, Infinity, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to modify', referrer, context);
                }
                for (let i = 1; i < args.length; i++) {
                    (array as ContextValue[]).unshift(args[i]);
                }
                return null;
            })
        ),

        pop: Utils.injectHelp(
            'Array.pop(array)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to modify', referrer, context);
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
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to modify', referrer, context);
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
            createFunctionHandler(1, 3, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as source', referrer, context);
                }
                if (args.length > 1) {
                    if (typeof args[1] !== 'number') {
                        Utils.raise(TypeError, 'expect a number as begin index', referrer, context);
                    }
                    if (args.length > 2) {
                        if (typeof args[2] !== 'number') {
                            Utils.raise(TypeError, 'expect a number as end index', referrer, context);
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
            createFunctionHandler(3, Infinity, (args, referrer, context) => {

                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to operate on', referrer, context);
                }

                const index = args[1];
                if (typeof index !== 'number') {
                    Utils.raise(TypeError, 'expect a number as start index', referrer, context);
                }

                const arraySize = (array as ContextValue[]).length;
                const normalizedIndex = Utils.normalizeIndex(
                    index as number,
                    (array as ContextValue[]).length,
                    referrer,
                    context,
                    true,
                );

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
            createFunctionHandler(2, 3, (args, referrer, context) => {

                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const index = args[1];
                if (typeof index !== 'number') {
                    Utils.raise(TypeError, 'expect a number as start index', referrer, context);
                }

                const arraySize = (array as ContextValue[]).length;
                const normalizedIndex = Utils.normalizeIndex(
                    index as number,
                    (array as ContextValue[]).length,
                    referrer,
                    context,
                );

                if (args.length === 3) {
                    if (typeof args[2] !== 'number') {
                        Utils.raise(TypeError, 'expect a number as removing count', referrer, context);
                    }
                    if (args[2] as number < 0 || args[2] !== args[2]) {
                        Utils.raise(RangeError, 'invalid removing count', referrer, context);
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
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to operate on', referrer, context);
                }
                (array as ContextValue[]).length = 0;
                return null;
            })
        ),

        flat: Utils.injectHelp(
            'Array.flat(arrays, depth = 1)',
            createFunctionHandler(1, 2, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to flat', referrer, context);
                }
                const depth = (args.length === 2) ? args[1] : 1;
                if (typeof depth !== 'number') {
                    Utils.raise(TypeError, 'expect a number as depth', referrer, context);
                }
                if ((depth as number) <= 0 || depth !== depth) {
                    Utils.raise(RangeError, 'invalid depth', referrer, context);
                }
                return (array as unknown[]).flat(depth as number) as ContextValue[];
            })
        ),

        reverse: Utils.injectHelp(
            'Array.reverse(array)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to reverse', referrer, context);
                }
                return array.reverse();
            })
        ),

        unpack: Utils.injectHelp(
            'Array.unpack(array, names, loose = false)',
            createFunctionHandler(2, 3, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to unpack', referrer, context);
                }

                const names = args[1] as string[];
                if (!Array.isArray(names)) {
                    Utils.raise(TypeError, 'expect an array of strings as variable names', referrer, context);
                }

                const nameCount = (names as string[]).length;
                const arraySize = (array as ContextValue[]).length;

                for (let i = 0; i < nameCount; i++) {
                    if (typeof (names as string[])[i] !== 'string') {
                        Utils.raise(TypeError, 'expect strings as variable names', referrer, context);
                    }
                }

                const loose = args.length === 3 && args[2];
                if (typeof loose !== 'boolean') {
                    Utils.raise(TypeError, 'expect a boolean as loose option', referrer, context);
                }

                const { store } = context;
                if (loose) {
                    if (nameCount > arraySize) {
                        for (let i = 0; i < arraySize; i++) {
                            store[names[i]] = array[i];
                        }
                        for (let i = arraySize; i < nameCount; i++) {
                            store[names[i]] = null;
                        }
                    } else {
                        for (let i = 0; i < nameCount; i++) {
                            store[names[i]] = array[i];
                        }
                    }
                } else {
                    if (nameCount > arraySize) {
                        Utils.raise(RangeError, 'not enough values in the given array', referrer, context);
                    }
                    for (let i = 0; i < nameCount; i++) {
                        store[names[i]] = array[i];
                    }
                }

                return null;

            })
        ),

        indexOf: Utils.injectHelp(
            'Array.indexOf(array, value)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to search in', referrer, context);
                }
                return (array as ContextValue[]).indexOf(args[1]);
            })
        ),

        lastIndexOf: Utils.injectHelp(
            'Array.lastIndexOf(array, value)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to search in', referrer, context);
                }
                return (array as ContextValue[]).lastIndexOf(args[1]);
            })
        ),

        includes: Utils.injectHelp(
            'Array.includes(array, value)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array to check', referrer, context);
                }
                return (array as ContextValue[]).includes(args[1]);
            })
        ),

        sort: Utils.injectHelp(
            'Array.sort(array, compareFn?)',
            createFunctionHandler(1, 2, (args, referrer, context) => {

                const array = args[0];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const compareFn = args[1];
                let _compareFn;
                if (args.length > 1 && !isInvocable(compareFn)) {
                    Utils.raise(TypeError, 'expect an invocable as compare function', referrer, context);
                }

                if (compareFn) {
                    _compareFn = (a: ContextValue, b: ContextValue) => (
                        invoke(
                            compareFn,
                            Utils.createRawArray([a, b], referrer),
                            referrer,
                            context,
                            null,
                        ) as number
                    );
                }

                return (array as ContextValue[]).sort(_compareFn);

            })
        ),

        forEach: Utils.injectHelp(
            'Array.forEach(array, callback)',
            createFunctionHandler(2, 2, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const callback = args[1];
                if (!isInvocable(callback)) {
                    Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
                }

                for (let i = 0; i < array.length; i++) {
                    invoke(callback,
                        Utils.createRawArray([array[i], i, array], referrer),
                        referrer,
                        context,
                        null,
                    );
                }

                return null;

            })
        ),

        map: Utils.injectHelp(
            'Array.map(array, callback)',
            createFunctionHandler(2, 2, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const callback = args[1];
                if (!isInvocable(callback)) {
                    Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
                }

                return array.map((element, index) => (
                    invoke(
                        callback,
                        Utils.createRawArray([element, index, array], referrer),
                        referrer,
                        context,
                        null,
                    )
                ));

            })
        ),

        filter: Utils.injectHelp(
            'Array.filter(array, callback)',
            createFunctionHandler(2, 2, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const callback = args[1];
                if (!isInvocable(callback)) {
                    Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
                }

                return array.filter((element, index) => {
                    const indicator = invoke(
                        callback,
                        Utils.createRawArray([element, index, array], referrer),
                        referrer,
                        context,
                        null,
                    );
                    if (typeof indicator !== 'boolean') {
                        Utils.raise(TypeError, 'expect a boolean as indicator', referrer, context);
                    }
                    return indicator;
                });

            })
        ),

        every: Utils.injectHelp(
            'Array.every(array, callback)',
            createFunctionHandler(2, 2, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const callback = args[1];
                if (!isInvocable(callback)) {
                    Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
                }

                return array.every((element, index) => {
                    const indicator = invoke(
                        callback,
                        Utils.createRawArray([element, index, array], referrer),
                        referrer,
                        context,
                        null,
                    );
                    if (typeof indicator !== 'boolean') {
                        Utils.raise(TypeError, 'expect a boolean as indicator', referrer, context);
                    }
                    return indicator;
                });

            })
        ),

        some: Utils.injectHelp(
            'Array.some(array, callback)',
            createFunctionHandler(2, 2, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const callback = args[1];
                if (!isInvocable(callback)) {
                    Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
                }

                return array.some((element, index) => {
                    const indicator = invoke(
                        callback,
                        Utils.createRawArray([element, index, array], referrer),
                        referrer,
                        context,
                        null,
                    );
                    if (typeof indicator !== 'boolean') {
                        Utils.raise(TypeError, 'expect a boolean as indicator', referrer, context);
                    }
                    return indicator;
                });

            })
        ),

        findIndex: Utils.injectHelp(
            'Array.findIndex(array, callback)',
            createFunctionHandler(2, 2, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const callback = args[1];
                if (!isInvocable(callback)) {
                    Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
                }

                const resultIndex = array.findIndex((element, index) => {
                    const indicator = invoke(
                        callback,
                        Utils.createRawArray([element, index, array], referrer),
                        referrer,
                        context,
                        null,
                    );
                    if (typeof indicator !== 'boolean') {
                        Utils.raise(TypeError, 'expect a boolean as indicator', referrer, context);
                    }
                    return indicator;
                });

                if (resultIndex === -1) {
                    Utils.raise(Error, 'cannot find the wanted element index', referrer, context);
                }

                return resultIndex;

            })
        ),

        find: Utils.injectHelp(
            'Array.find(array, callback)',
            createFunctionHandler(2, 2, (args, referrer, context) => {

                const array = args[0] as ContextValue[];
                if (!Array.isArray(array)) {
                    Utils.raise(TypeError, 'expect an array as the first argument', referrer, context);
                }

                const callback = args[1];
                if (!isInvocable(callback)) {
                    Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
                }

                const resultIndex = array.findIndex((element, index) => {
                    const indicator = invoke(
                        callback,
                        Utils.createRawArray([element, index, array], referrer),
                        referrer,
                        context,
                        null,
                    );
                    if (typeof indicator !== 'boolean') {
                        Utils.raise(TypeError, 'expect a boolean as indicator', referrer, context);
                    }
                    return indicator;
                });

                if (resultIndex === -1) {
                    Utils.raise(Error, 'cannot find the wanted element index', referrer, context);
                }

                return array[resultIndex];

            })
        ),

    })
);
