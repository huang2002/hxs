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

]);
