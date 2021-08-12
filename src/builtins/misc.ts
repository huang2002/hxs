import { ContextValue, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const print = Utils.injectHelp(
    'print(message...)',
    createFunctionHandler(0, Infinity, (args, referrer, context) => {
        let message = '';
        for (let i = 0; i < args.length; i++) {
            message += Utils.toString(args[i]);
        }
        console.log(message);
        return null;
    })
);

export const set = Utils.injectHelp(
    'set(array_or_dict, index_or_key, value)',
    createFunctionHandler(3, 3, (args, referrer, context) => {

        const target = args[0];
        const index = args[1];

        if (Array.isArray(target)) {

            if (typeof index !== 'number') {
                Utils.raise(TypeError, 'expect a number as index', referrer, context);
            }

            const normalizedIndex = Utils.normalizeIndex(
                index as number,
                target.length,
                referrer,
                context,
            );

            target[normalizedIndex] = args[2];

        } else if (Utils.isDict(target)) {

            if (typeof index !== 'string') {
                Utils.raise(TypeError, `expect a string as key`, referrer, context);
            }

            target[index as string] = args[2];

        } else {
            Utils.raise(TypeError, `expect an array or dict to modify`, referrer, context);
        }

        return null;

    })
);

export const remove = Utils.injectHelp(
    'remove(array_or_dict, index_or_key)',
    createFunctionHandler(2, 2, (args, referrer, context) => {

        const target = args[0];
        const index = args[1];

        if (Array.isArray(target)) {

            if (typeof index !== 'number') {
                Utils.raise(TypeError, 'expect a number as index', referrer, context);
            }

            const normalizedIndex = Utils.normalizeIndex(
                index as number,
                target.length,
                referrer,
                context,
            );

            Utils.removeElements(target, normalizedIndex, 1);

        } else if (Utils.isDict(target)) {

            if (typeof index !== 'string') {
                Utils.raise(TypeError, `expect a string as key`, referrer, context);
            }

            delete target[index as string];

        } else {
            Utils.raise(TypeError, `expect an array or dict to modify`, referrer, context);
        }

        return null;

    })
);

export const sizeOf = Utils.injectHelp(
    'sizeOf(array_or_string)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const target = args[0];
        if (Array.isArray(target) || typeof target === 'string') {
            return target.length;
        } else {
            Utils.raise(TypeError, `expect an array or string`, referrer, context);
            return null; // for type checking
        }
    })
);

export const slice = Utils.injectHelp(
    'slice(array_or_string, begin = 0, end = sizeOf(array_or_string))',
    createFunctionHandler(1, 3, (args, referrer, context) => {
        const target = args[0];
        if (Array.isArray(target) || typeof target === 'string') {
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
            return target.slice(
                args[1] as number | undefined,
                args[2] as number | undefined,
            );
        } else {
            Utils.raise(TypeError, `expect an array or string`, referrer, context);
            return null; // for type checking
        }
    })
);


export const clone = Utils.injectHelp(
    'clone(array_or_dict)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const target = args[0];
        if (Array.isArray(target)) {
            return target.slice();
        } else if (Utils.isDict(target)) {
            return Utils.createDict(target);
        } else {
            Utils.raise(TypeError, `expect an array or dict to clone`, referrer, context);
            return null; // for type checking
        }
    })
);

export const indexOf = Utils.injectHelp(
    'indexOf(array_or_string, value_or_substring)',
    createFunctionHandler(2, 2, (args, referrer, context) => {
        const target = args[0] as string | (ContextValue[]);
        const targetIsString = typeof target === 'string';
        if (!targetIsString && !Array.isArray(target)) {
            Utils.raise(TypeError, 'expect an array to search in', referrer, context);
        }
        if (targetIsString && typeof args[1] !== 'string') {
            Utils.raise(TypeError, 'expect another string to search for', referrer, context);
        }
        return target.indexOf(args[1] as string);
    })
);

export const lastIndexOf = Utils.injectHelp(
    'lastIndexOf(array_or_string, value_or_substring)',
    createFunctionHandler(2, 2, (args, referrer, context) => {
        const target = args[0] as string | (ContextValue[]);
        const targetIsString = typeof target === 'string';
        if (!targetIsString && !Array.isArray(target)) {
            Utils.raise(TypeError, 'expect an array to search in', referrer, context);
        }
        if (targetIsString && typeof args[1] !== 'string') {
            Utils.raise(TypeError, 'expect another string to search for', referrer, context);
        }
        return target.lastIndexOf(args[1] as string);
    })
);

export const includes = Utils.injectHelp(
    'includes(array_or_string, value_or_substring)',
    createFunctionHandler(2, 2, (args, referrer, context) => {
        const target = args[0] as string | (ContextValue[]);
        const targetIsString = typeof target === 'string';
        if (!targetIsString && !Array.isArray(target)) {
            Utils.raise(TypeError, 'expect an array to search in', referrer, context);
        }
        if (targetIsString && typeof args[1] !== 'string') {
            Utils.raise(TypeError, 'expect another string to search for', referrer, context);
        }
        return target.includes(args[1] as string);
    })
);
