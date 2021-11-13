import { SpanNode } from '3h-ast';
import { SyntaxHandler, Utils } from '../common';
import { evalCompiledExpression } from '../eval/evalExpression';
import { compileNodes, evalCompiledNodes } from "../eval/evalNodes";
import { FunctionHandler, ScriptContext, SyntaxNode } from '../index';
import { parseArgList } from './common';
import { createFunctionHandler } from './createFunctionHandler';

/**
 * Create an expression from source code.
 */
export const createInlineExpression = (
    buffer: readonly SyntaxNode[],
    index: number,
    context: ScriptContext,
): FunctionHandler => {

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

    return createFunctionHandler(
        argList.requiredCount,
        Infinity,
        (args, referrer, _context, thisArg) => {

            const scopeStore = Utils.createDict(context.store);

            scopeStore._ = null;
            scopeStore.this = thisArg;
            scopeStore.arguments = args;

            const scopeContext = Utils.extendContext(context, scopeStore);

            const argDefinitions = argList.args;
            for (let i = 0; i < argDefinitions.length; i++) {
                const argName = argDefinitions[i].name;
                if (i < args.length) {
                    scopeStore[argName] = args[i];
                } else {
                    const defaultValue = argDefinitions[i].default;
                    if (defaultValue !== null) {
                        scopeStore[argName] = evalCompiledExpression(
                            defaultValue,
                            scopeContext,
                            true,
                            true,
                        );
                    } else {
                        scopeStore[argName] = null;
                    }
                }
            }
            if (argList.restArg !== null) {
                scopeStore[argList.restArg] = args.slice(argDefinitions.length);
            }

            // rewrite
            scopeStore._ = null;
            scopeStore.this = thisArg;
            scopeStore.arguments = args;

            return evalCompiledNodes(compiledBody, scopeContext, true, true);

        }
    );

};

export const inlineExpressionHandler: SyntaxHandler = (buffer, index, context) => {
    const func = createInlineExpression(buffer, index, context);
    const valueNode = Utils.createValueNode(func, buffer[index]);
    Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
};
