import { WordNode } from '3h-ast';
import { ContextValue, SyntaxNode, ScriptContext, Utils } from '../common';

export type FunctionCallback = (
    args: ContextValue[],
    referrer: SyntaxNode,
    context: ScriptContext,
    thisArg: ContextValue,
) => ContextValue;

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
