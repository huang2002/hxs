import { SpanNode } from '3h-ast';
import { ContextValue, SyntaxHandler, Utils, ScriptContext } from '../common';
import { evalCompiledExpression } from '../eval/evalExpression';
import { compileNodes, evalCompiledNodes } from "../eval/evalNodes";
import { parseArgList } from './common';
import { createFunctionHandler } from './createFunctionHandler';

/**
 * Create a function from source code.
 */
export const createInlineFunction: SyntaxHandler = (buffer, index, context) => {

    const argSpan = buffer[index + 1];
    const bodySpan = buffer[index + 2];

    if (index + 2 >= buffer.length
        || argSpan.type !== 'span'
        || argSpan.start !== '('
        || bodySpan.type !== 'span'
        || bodySpan.start !== '{') {
        Utils.raise(SyntaxError, 'invalid function declaration', buffer[index], context);
    }

    const argList = parseArgList((argSpan as SpanNode).body, context);
    const body = (bodySpan as SpanNode).body;
    const compiledBody = compileNodes(body, context);

    const func = createFunctionHandler(
        argList.requiredCount,
        Infinity,
        (args, referrer, _context, thisArg) => {

            const scopeStore = Utils.createDict(context.store);

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

            const RETURN_FLAG = Symbol('hxs-return-flag');
            let returnValue: ContextValue = null;

            scopeStore.return = createFunctionHandler(0, 1, args => {
                if (args.length) {
                    returnValue = args[0];
                }
                throw RETURN_FLAG;
            });

            scopeStore.forward = createFunctionHandler(1, 1, (args, _referrer) => {
                const names = args[0] as string[];
                if (!Array.isArray(names)) {
                    Utils.raise(TypeError, 'expect an array of strings', _referrer, context);
                }
                for (let i = 0; i < names.length; i++) {
                    const name = names[i];
                    if (typeof name !== 'string') {
                        Utils.raise(TypeError, 'expect an array of strings', _referrer, context);
                    }
                    if (name in scopeStore) {
                        context.store[name] = scopeStore[name];
                    } else {
                        Utils.raise(ReferenceError, `${Utils.toDisplay(name)} is not defined`, _referrer, context);
                    }
                }
                return null;
            });

            try {
                evalCompiledNodes(compiledBody, scopeContext, true, true);
            } catch (err) {
                if (err !== RETURN_FLAG) {
                    throw err;
                }
            }

            return returnValue;

        }
    );

    const valueNode = Utils.createValueNode(func, buffer[index]);
    Utils.replaceBuffer(buffer, index, 3, valueNode);

};
