import { SpanNode } from '3h-ast';
import { ContextValue, SyntaxHandler, Utils, ScriptContext } from '../common';
import { compileNodes, evalCompiledNodes } from "../eval/evalNodes";
import { parseArgList } from './common';
import { createFunctionHandler } from './createFunctionHandler';

/**
 * Create an expression from source code.
 */
export const createInlineExpression: SyntaxHandler = (buffer, index, context) => {

    const argSpan = buffer[index - 1];
    const bodySpan = buffer[index + 1];

    if (index + 1 >= buffer.length
        || argSpan.type !== 'span'
        || argSpan.start !== '('
        || bodySpan.type !== 'span'
        || bodySpan.start !== '(') {
        Utils.raise(SyntaxError, 'invalid expression declaration', buffer[index], context);
    }

    const argList = parseArgList((argSpan as SpanNode).body, context);
    const body = (bodySpan as SpanNode).body;
    const compiledBody = compileNodes(body, context);

    const func = createFunctionHandler(argList.length, Infinity, (args, referrer, _context) => {

        const scopeStore = new Map(context.store);
        for (let i = 0; i < args.length; i++) {
            scopeStore.set(argList[i], args[i] as ContextValue);
        }

        scopeStore.set('_', null);
        scopeStore.set('arguments', args);

        const scopeContext: ScriptContext = {
            store: scopeStore,
            source: context.source,
        };

        return evalCompiledNodes(compiledBody, scopeContext, true);

    });

    const valueNode = Utils.createValueNode(func, buffer[index]);
    Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

};
