import { builtinIf } from './builtins/if';
import { ContextStore, ContextValue } from './common';

export const builtins: ContextStore = new Map<string, ContextValue>([

    ['true', true],
    ['false', false],
    ['Infinity', Infinity],
    ['NaN', NaN],
    ['null', null],

    ['if', builtinIf],

]);
