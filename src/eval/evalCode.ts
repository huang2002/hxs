import { parse } from '3h-ast';
import { builtins } from '../builtins/index';
import { Dict, ResolvedModules, ScriptContext, Utils } from '../common';
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
    if (!_context.exports) {
        _context.exports = Object.create(null) as Dict;
    }
    if (!_context.resolvedModules) {
        _context.resolvedModules = Object.create(null) as ResolvedModules;
    }
    if (!_context.source) {
        _context.source = 'unknown';
    }
    if (!_context.basePath) {
        _context.basePath = '';
    }
    if (!_context.stack) {
        _context.stack = [];
    }
    return evalNodes(parse(code).ast, _context);
};
