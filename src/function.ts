import { SpanNode, WordNode } from '3h-ast';
import { FunctionHandler, ContextValue, SyntaxHandler, SyntaxNode, Utils, ScriptContext } from './common';
import { evalList } from "./eval/evalList";
import { evalNodes } from "./eval/evalNodes";

const raiseArgError = (referrer: SyntaxNode, context: ScriptContext) => {
    Utils.raise(SyntaxError, 'invalid argument declaration', referrer, context);
};

/**
 * Parse single argument declaration.
 */
export const parseArg = (
    rawArgList: readonly SyntaxNode[],
    begin: number,
    end: number,
    context: ScriptContext,
) => {
    const firstNode = rawArgList[begin];
    if (firstNode.type !== 'word') {
        raiseArgError(firstNode, context);
    }
    let result!: string;
    switch (end - begin) {
        case 1: {
            result = (firstNode as WordNode).value;
            break;
        }
        default: {
            // TODO: implement default args and remove this error
            raiseArgError(firstNode, context);
        }
    }
    return result;
};

/**
 * Parse argument list.
 */
export const parseArgList = (
    rawArgList: readonly SyntaxNode[],
    context: ScriptContext,
) => {
    const result = [];
    let l = 0;
    for (let r = 0; r < rawArgList.length; r++) {
        const node = rawArgList[r];
        if (node.type !== 'symbol' || node.value !== ',') {
            continue;
        }
        result.push(parseArg(rawArgList, l, r, context));
        l = r + 1;
    }
    if (l < rawArgList.length) { // ends without a comma
        result.push(parseArg(rawArgList, l, rawArgList.length, context));
    }
    return result;
};

export type FunctionCallback = (
    args: ContextValue[],
    referrer: SyntaxNode,
    context: ScriptContext,
) => ContextValue;

export const createFunctionHandler = (
    minArgCount: number,
    maxArgCount: number,
    callback: FunctionCallback,
): FunctionHandler => (
    (rawArgs, referrer, context) => {
        const args = evalList(rawArgs, context);
        if (args.length < minArgCount) {
            Utils.raise(TypeError, 'too few arguments', referrer, context);
        } else if (args.length > maxArgCount) {
            Utils.raise(TypeError, 'too many arguments', referrer, context);
        }
        return callback(args, referrer, context);
    }
);

/**
 * Create a function from source code.
 */
export const createInlineFunction: SyntaxHandler = (buffer, index, context) => {

    const argSpan = buffer[index + 1];
    const bodySpan = buffer[index + 2];

    if (
        index + 2 >= buffer.length
        || argSpan.type !== 'span'
        || argSpan.start !== '('
        || bodySpan.type !== 'span'
        || bodySpan.start !== '{'
    ) {
        Utils.raise(SyntaxError, 'invalid function declaration', buffer[index], context);
    }

    const argList = parseArgList((argSpan as SpanNode).body, context);
    const body = (bodySpan as SpanNode).body;

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
            evalNodes(body, scopeContext);
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
