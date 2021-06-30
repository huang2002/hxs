import { builtinIf } from './builtins/if';
import { builtinFor, builtinWhile } from './builtins/loop';
import { ContextStore, ContextValue } from './common';

export const builtins: ContextStore = new Map<string, ContextValue>([

    ['true', true],
    ['false', false],
    ['Infinity', Infinity],
    ['NaN', NaN],
    ['null', null],

    ['if', builtinIf],
    ['while', builtinWhile],
    ['for', builtinFor],

]);
