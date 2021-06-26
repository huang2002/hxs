import { ScriptContext, ScriptContextValue } from './common';

export const builtins: ScriptContext = new Map<string, ScriptContextValue>([

    ['true', true],
    ['false', false],
    ['Infinity', Infinity],
    ['NaN', NaN],

]);
