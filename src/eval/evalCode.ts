import { parse } from '3h-ast';
import { builtins } from '../builtins/index';
import { ScriptContext, Utils } from '../common';
import { evalNodes } from './evalNodes';

/**
 * Execute the given code.
 */
export const evalCode = (
    code: string,
    context?: Partial<ScriptContext>
) => {
    const _context = {} as ScriptContext;
    if (context) {
        Object.assign(_context, context);
    }
    if (!_context.store) {
        _context.store = Utils.createDict(builtins);
    }
    if (!_context.source) {
        _context.source = 'unknown';
    }
    return evalNodes(parse(code).ast, _context);
};
