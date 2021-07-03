import { builtinIf } from './builtins/if';
import { builtinFor, builtinWhile } from './builtins/loop';
import { ContextStore, ContextValue, Dict, FunctionHandler, HELP_SYMBOL, Utils } from './common';
import { createFunctionHandler } from './function';

export const builtins: ContextStore = new Map<string, ContextValue>([

    ['true', true],
    ['false', false],
    ['Infinity', Infinity],
    ['NaN', NaN],
    ['null', null],

    ['if', builtinIf],
    ['while', builtinWhile],
    ['for', builtinFor],

    ['help', Utils.injectHelp(
        'help(target)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            switch (typeof args[0]) {
                case 'function':
                case 'object': {
                    if (HELP_SYMBOL in (args[0] as Dict | FunctionHandler)) {
                        return (args[0] as Dict | FunctionHandler)[HELP_SYMBOL]!;
                    }
                    break;
                }
                // TODO: case 'string': { /* search help */ }
            }
            return 'no help available';
        })
    )],

    ['dir', Utils.injectHelp(
        'dir(dict)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            const dict = args[0];
            if (!Utils.isDict(dict)) {
                Utils.raise(TypeError, 'expect a dict', referer, context);
            }
            return Object.keys(dict as Dict);
        })
    )],

    ['typeOf', Utils.injectHelp(
        'typeOf(value)',
        createFunctionHandler(1, 1, (args, referer, context) => {
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
                    Utils.raise(TypeError, 'unrecognized type', referer, context);
                    return null;
                }
            }
        })
    )],

    ['number', Utils.injectHelp(
        'number(value)',
        createFunctionHandler(1, 1, (args, context, env) => {
            const type = typeof args[0];
            if (type === 'object' || type === 'function') {
                return NaN;
            } else {
                return Number(args[0]);
            }
        })
    )],

    ['string', Utils.injectHelp(
        'string(value)',
        createFunctionHandler(1, 1, (args, context, env) => {
            return Utils.toString(args[0]);
        })
    )],

    ['boolean', Utils.injectHelp(
        'boolean(value)',
        createFunctionHandler(1, 1, (args, context, env) => {
            return Boolean(args[0]);
        })
    )],

]);
