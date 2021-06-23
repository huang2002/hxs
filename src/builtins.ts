import { ScriptContext } from './common';

export const builtins: ScriptContext = new Map<string, unknown>([

    ['true', true],
    ['false', false],
    ['Infinity', Infinity],
    ['NaN', NaN],

]);
