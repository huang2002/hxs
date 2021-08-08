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
    `string(value, preview_size = 10, preview_indent = '  ')`,
    createFunctionHandler(1, 3, (args, referrer, context) => {
        const previewSize = args.length >= 2 ? args[1] as number : 10;
        if (typeof previewSize !== 'number') {
            Utils.raise(TypeError, 'expect a number as preview size', referrer, context);
        }
        const previewIndent = args.length >= 3 ? args[2] as string : '  ';
        if (typeof previewIndent !== 'string') {
            Utils.raise(TypeError, 'expect a string as preview indent', referrer, context);
        }
        return Utils.toString(args[0], previewSize, previewIndent);
    })
);

export const boolean = Utils.injectHelp(
    'boolean(value)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        return Boolean(args[0]);
    })
);
