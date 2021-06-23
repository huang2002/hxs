import { SpanNode, WordNode } from '3h-ast';
import { FunctionHandler, ScriptContext, SyntaxHandler, SyntaxNode, Utils } from './common';
import { executeList, executeNodes } from './executors';

const raiseArgError = (referer: SyntaxNode, source: string) => {
    Utils.raise(SyntaxError, 'invalid argument declaration', referer, source);
};

/**
 * Parse single argument declaration.
 */
export const parseArg = (
    rawArgList: readonly SyntaxNode[],
    begin: number,
    end: number,
    context: ScriptContext,
    source: string,
) => {
    const firstNode = rawArgList[begin];
    if (firstNode.type !== 'word') {
        raiseArgError(firstNode, source);
    }
    let result!: string;
    switch (end - begin) {
        case 1: {
            result = (firstNode as WordNode).value;
            break;
        }
        default: {
            // TODO: implement default args and remove this error
            raiseArgError(firstNode, source);
        }
    }
    return result;
};
/** dts2md break */
/**
 * Parse argument list.
 */
export const parseArgList = (
    rawArgList: readonly SyntaxNode[],
    context: ScriptContext,
    source: string,
) => {
    const result = [];
    let l = 0;
    for (let r = 0; r < rawArgList.length; r++) {
        const node = rawArgList[r];
        if (node.type !== 'symbol' || node.value !== ',') {
            continue;
        }
        result.push(parseArg(rawArgList, l, r, context, source));
        l = r + 1;
    }
    if (l < rawArgList.length) { // ends without a comma
        result.push(parseArg(rawArgList, l, rawArgList.length, context, source));
    }
    return result;
};
/** dts2md break */
export type FunctionCallback = (
    args: unknown[],
    referer: SyntaxNode,
    context: ScriptContext,
    source: string,
) => unknown;
/** dts2md break */
export const createFunctionHandler = (
    minArgCount: number,
    maxArgCount: number,
    callback: FunctionCallback,
): FunctionHandler => (
    (rawArgs, referer, context, source) => {
        const args = executeList(rawArgs, context, source);
        if (args.length < minArgCount) {
            Utils.raise(TypeError, 'too few arguments', referer, source);
        } else if (args.length > maxArgCount) {
            Utils.raise(TypeError, 'too many arguments', referer, source);
        }
        return callback(args, referer, context, source);
    }
);
/** dts2md break */
/**
 * Create a function from source code.
 */
export const createInlineFunction: SyntaxHandler = (buffer, i, ctx, src) => {

    const argSpan = buffer[i + 1];
    const bodySpan = buffer[i + 2];

    if (
        i + 2 >= buffer.length
        || argSpan.type !== 'span'
        || argSpan.start !== '('
        || bodySpan.type !== 'span'
        || bodySpan.start !== '{'
    ) {
        Utils.raise(SyntaxError, 'invalid function declaration', buffer[i], src);
    }

    const argList = parseArgList((argSpan as SpanNode).body, ctx, src);
    const body = (bodySpan as SpanNode).body;

    const func = createFunctionHandler(0, Infinity, (args, referer, _ctx, _src) => {

        const scope = new Map(_ctx);
        for (let i = 0; i < args.length; i++) {
            scope.set(argList[i], args[i]);
        }

        const RETURN_FLAG = Symbol('hxs_return_flag');
        const forwardVariables = new Set<string>();
        let returnValue: unknown = null;

        scope.set(
            'return',
            createFunctionHandler(0, 1, args => {
                if (args.length) {
                    returnValue = args[0];
                }
                throw RETURN_FLAG;
            })
        );

        scope.set(
            'forward',
            createFunctionHandler(1, 1, (args, _referer) => {
                const names = args[0];
                if (!Array.isArray(names)) {
                    Utils.raise(TypeError, 'expect an array of strings', _referer, _src);
                }
                for (let i = 0; i < (names as string[]).length; i++) {
                    const name = (names as string[])[i];
                    if (typeof name !== 'string') {
                        Utils.raise(TypeError, 'expect an array of strings', _referer, _src);
                    }
                    forwardVariables.add(name);
                }
            })
        );

        try {
            executeNodes(body, scope, src);
        } catch (err) {
            if (err !== RETURN_FLAG) {
                throw err;
            }
        }

        forwardVariables.forEach(name => {
            if (scope.has(name)) {
                ctx.set(name, scope.get(name));
            }
        });

        return returnValue;

    });

    const valueNode = Utils.createValueNode(func, buffer[i]);
    Utils.replaceBuffer(buffer, i, 3, valueNode);

};
