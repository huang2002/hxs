import { builtinArray } from './array';
import { builtinIf } from './if';
import { builtinFor, builtinWhile } from './loop';
import { ContextStore, ContextValue, Dict, FunctionHandler, HELP_SYMBOL, Utils } from '../common';
import { createFunctionHandler } from '../function';

export const builtins: ContextStore = new Map<string, ContextValue>([

    ['true', true],
    ['false', false],
    ['Infinity', Infinity],
    ['NaN', NaN],
    ['null', null],

    ['if', builtinIf],
    ['while', builtinWhile],
    ['for', builtinFor],

    ['Array', builtinArray],

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

    ['exist', Utils.injectHelp(
        'exist(variableName)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            if (typeof args[0] !== 'string') {
                Utils.raise(TypeError, 'expect a string as variable name', referer, context);
            }
            return context.store.has(args[0] as string);
        })
    )],

    ['delete', Utils.injectHelp(
        'delete(variableName)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            const name = args[0];
            if (typeof name !== 'string') {
                Utils.raise(TypeError, 'expect a string as variable name', referer, context);
            }
            const { store } = context;
            if (!store.has(name as string)) {
                Utils.raise(ReferenceError, `"${name}" is not defined`, referer, context);
            }
            store.delete(name as string);
            return null;
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
        createFunctionHandler(1, 1, (args, referer, context) => {
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
        createFunctionHandler(1, 1, (args, referer, context) => {
            return Utils.toDisplay(args[0]);
        })
    )],

    ['boolean', Utils.injectHelp(
        'boolean(value)',
        createFunctionHandler(1, 1, (args, referer, context) => {
            return Boolean(args[0]);
        })
    )],

    ['print', Utils.injectHelp(
        'print(message...)',
        createFunctionHandler(0, Infinity, (args, referer, context) => {
            let message = '';
            for (let i = 0; i < args.length; i++) {
                message += Utils.toString(args[i]);
            }
            console.log(message);
            return null;
        })
    )],

]);
