import { builtinArray } from './array';
import { builtinIf } from './if';
import { builtinFor } from './for';
import { builtinWhile } from "./while";
import { ContextStore, ContextValue, Dict, FunctionHandler, HELP_SYMBOL, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { builtinString } from './string';
import { builtinDict } from './dict';
import { builtinFunction } from './function';
import { builtinMath } from './math';

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
    ['String', builtinString],
    ['Dict', builtinDict],
    ['Function', builtinFunction],
    ['Math', builtinMath],

    ['help', Utils.injectHelp(
        'help(target)',
        createFunctionHandler(1, 1, (args, referrer, context) => {
            switch (typeof args[0]) {
                case 'function':
                case 'object': {
                    if (args[0] && HELP_SYMBOL in (args[0] as Dict | FunctionHandler)) {
                        return (args[0] as Dict | FunctionHandler)[HELP_SYMBOL]!;
                    }
                    break;
                }
                // TODO: case 'string': { /* search help */ }
            }
            return 'no help available';
        })
    )],

    ['injectHelp', Utils.injectHelp(
        'injectHelp(helpInfo, target)',
        createFunctionHandler(2, 2, (args, referrer, context) => {
            const helpInfo = args[0] as string;
            if (typeof helpInfo !== 'string') {
                Utils.raise(TypeError, 'expect a string as help info', referrer, context);
            }
            const target = args[1] as Dict | FunctionHandler;
            if (typeof target !== 'function' && !Utils.isDict(target)) {
                Utils.raise(TypeError, 'expect a dict or function as target', referrer, context);
            }
            target[HELP_SYMBOL] = helpInfo;
            return target;
        })
    )],

    ['exist', Utils.injectHelp(
        'exist(variableName)',
        createFunctionHandler(1, 1, (args, referrer, context) => {
            if (typeof args[0] !== 'string') {
                Utils.raise(TypeError, 'expect a string as variable name', referrer, context);
            }
            return context.store.has(args[0] as string);
        })
    )],

    ['delete', Utils.injectHelp(
        'delete(variableName)',
        createFunctionHandler(1, 1, (args, referrer, context) => {
            const name = args[0];
            if (typeof name !== 'string') {
                Utils.raise(TypeError, 'expect a string as variable name', referrer, context);
            }
            const { store } = context;
            if (!store.has(name as string)) {
                Utils.raise(ReferenceError, `"${name}" is not defined`, referrer, context);
            }
            store.delete(name as string);
            return null;
        })
    )],

    ['typeOf', Utils.injectHelp(
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
    )],

    ['number', Utils.injectHelp(
        'number(value)',
        createFunctionHandler(1, 1, (args, referrer, context) => {
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
        createFunctionHandler(1, 1, (args, referrer, context) => {
            return Utils.toDisplay(args[0]);
        })
    )],

    ['boolean', Utils.injectHelp(
        'boolean(value)',
        createFunctionHandler(1, 1, (args, referrer, context) => {
            return Boolean(args[0]);
        })
    )],

    ['print', Utils.injectHelp(
        'print(message...)',
        createFunctionHandler(0, Infinity, (args, referrer, context) => {
            let message = '';
            for (let i = 0; i < args.length; i++) {
                message += Utils.toString(args[i]);
            }
            console.log(message);
            return null;
        })
    )],

]);
