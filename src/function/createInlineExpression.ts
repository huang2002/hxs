import { SpanNode } from '3h-ast';
import { SyntaxHandler, Utils, ScriptContext } from '../common';
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

    const func = createFunctionHandler(
        argList.requiredCount,
        Infinity,
        (args, referrer, _context, thisArg) => {

            const scopeStore = Utils.createDict(context.store);
            const argDefinitions = argList.args;
            for (let i = 0; i < argDefinitions.length; i++) {
                if (i < args.length) {
                    scopeStore[argDefinitions[i].name] = args[i];
                } else {
                    scopeStore[argDefinitions[i].name] = argDefinitions[i].default;
                }
            }
            if (argList.restArg !== null) {
                scopeStore[argList.restArg] = args.slice(argDefinitions.length);
            }

            scopeStore._ = null;
            scopeStore.this = thisArg;
            scopeStore.arguments = args;

            const scopeContext: ScriptContext = {
                store: scopeStore,
                exports: context.exports,
                resolvedModules: context.resolvedModules,
                source: context.source,
                basePath: context.basePath,
            };

            return evalCompiledNodes(compiledBody, scopeContext, true);

        }
    );

    const valueNode = Utils.createValueNode(func, buffer[index]);
    Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

};
