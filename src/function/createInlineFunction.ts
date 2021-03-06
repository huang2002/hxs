import { SpanNode } from '3h-ast';
import { ContextValue, SyntaxHandler, Utils, ScriptContext } from '../common';
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

    const func = createFunctionHandler(argList.length, Infinity, (args, referrer, _context) => {

        const scopeStore = new Map(context.store);
        for (let i = 0; i < args.length; i++) {
            scopeStore.set(argList[i], args[i] as ContextValue);
        }

        const RETURN_FLAG = Symbol('hxs_return_flag');
        const forwardVariables = new Set<string>();
        let returnValue: ContextValue = null;

        scopeStore.set('arguments', args);

        scopeStore.set(
            'return',
            createFunctionHandler(0, 1, args => {
                if (args.length) {
                    returnValue = args[0];
                }
                throw RETURN_FLAG;
            })
        );

        scopeStore.set(
            'forward',
            createFunctionHandler(1, 1, (args, _referrer) => {
                const names = args[0];
                if (!Array.isArray(names)) {
                    Utils.raise(TypeError, 'expect an array of strings', _referrer, context);
                }
                for (let i = 0; i < (names as string[]).length; i++) {
                    const name = (names as string[])[i];
                    if (typeof name !== 'string') {
                        Utils.raise(TypeError, 'expect an array of strings', _referrer, context);
                    }
                    forwardVariables.add(name);
                }
                return null;
            })
        );

        const scopeContext: ScriptContext = {
            store: scopeStore,
            source: context.source,
        };

        try {
            evalCompiledNodes(compiledBody, scopeContext, true);
        } catch (err) {
            if (err !== RETURN_FLAG) {
                throw err;
            }
        }

        forwardVariables.forEach(name => {
            if (scopeStore.has(name)) {
                context.store.set(name, scopeStore.get(name)!);
            }
        });

        return returnValue;

    });

    const valueNode = Utils.createValueNode(func, buffer[index]);
    Utils.replaceBuffer(buffer, index, 3, valueNode);

};
