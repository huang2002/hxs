import { Utils } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';

export const typeOf = Utils.injectHelp(
    'typeOf(value)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const value = args[0];
        switch (typeof value) {
            case 'number': {
                return 'number';
            }
            case 'string': {
                return 'string';
            }
            case 'boolean': {
                return 'boolean';
            }
            case 'function': {
                return 'function';
            }
            case 'object': {
                if (!value) {
                    return 'null';
                } else if (Array.isArray(value)) {
                    return 'array';
                } else if (Utils.isDict(value)) {
                    return 'dict';
                }
            }
            default: {
                Utils.raise(TypeError, 'unrecognized type', referrer, context);
                return null;
            }
        }
    })
);

export const number = Utils.injectHelp(
    'number(value)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const type = typeof args[0];
        if (type === 'object' || type === 'function') {
            return NaN;
        } else {
            return Number(args[0]);
        }
    })
);

export const string = Utils.injectHelp(
    'string(value)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        return Utils.toDisplay(args[0]);
    })
);

export const boolean = Utils.injectHelp(
    'boolean(value)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        return Boolean(args[0]);
    })
);
