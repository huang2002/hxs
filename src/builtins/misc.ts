import { ContextValue, Dict, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { getKeysOf, removeProperty } from './common';

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

export const same = Utils.injectHelp(
    'same(a, b)',
    createFunctionHandler(2, 2, (args, referrer, context) => {
        return Object.is(args[0], args[1]);
    })
);

export const keys = Utils.injectHelp(
    'keys(dict)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const dict = args[0] as Dict;
        if (!Utils.isDict(dict)) {
            Utils.raise(TypeError, 'expect a dict', referrer, context);
        }
        return getKeysOf(dict, referrer, context);
    })
);

export const remove = Utils.injectHelp(
    'remove(arrayOrDict, indexOrKey)',
    createFunctionHandler(2, 2, (args, referrer, context) => {
        removeProperty(args[0], args[1], referrer, referrer, context);
        return null;
    })
);

export const sizeOf = Utils.injectHelp(
    'sizeOf(arrayOrString)',
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
    'slice(arrayOrString, begin = 0, end = sizeOf(arrayOrString))',
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
    'clone(arrayOrDict)',
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
    'indexOf(arrayOrString, valueOrSubstring)',
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
    'lastIndexOf(arrayOrString, valueOrSubstring)',
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
    'includes(arrayOrString, valueOrSubstring)',
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

export const assert = Utils.injectHelp(
    `assert(condition, errorMessage = 'assertion failed')`,
    createFunctionHandler(
        1,
        2,
        (args, referrer, context, thisArg) => {

            const condition = args[0] as boolean;
            if (typeof condition !== 'boolean') {
                Utils.raise(
                    TypeError,
                    'expect a boolean as condition',
                    referrer,
                    context,
                );
            }

            const errorMessage = (args.length > 1)
                ? args[1] as string
                : 'assertion failed';
            if (typeof errorMessage !== 'string') {
                Utils.raise(
                    TypeError,
                    'expect a string as error message',
                    referrer,
                    context,
                );
            }

            if (!condition) {
                Utils.raise(
                    Error,
                    errorMessage,
                    referrer,
                    context,
                );
            }

            return null;

        },
    )
);
