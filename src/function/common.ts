import { WordNode } from '3h-ast';
import { ContextValue, SyntaxNode, ScriptContext, Utils } from '../common';
import { evalExpression } from '../eval/evalExpression';

export type FunctionCallback = (
    args: ContextValue[],
    referrer: SyntaxNode,
    context: ScriptContext,
    thisArg: ContextValue,
) => ContextValue;

const raiseArgError = (referrer: SyntaxNode, context: ScriptContext) => {
    Utils.raise(SyntaxError, 'invalid argument declaration', referrer, context);
};

export interface ArgDefinition {
    name: string;
    required: boolean;
    default: ContextValue;
}

export interface ArgList {
    args: ArgDefinition[];
    requiredCount: number;
}

/**
 * Parse single argument declaration.
 */
export const parseArg = (
    rawArgs: readonly SyntaxNode[],
    begin: number,
    end: number,
    context: ScriptContext,
    allowRequired: boolean,
): ArgDefinition => {
    const firstNode = rawArgs[begin] as WordNode;
    if (firstNode.type !== 'word') {
        raiseArgError(firstNode, context);
    }
    if (end - begin === 1) {
        if (!allowRequired) {
            raiseArgError(firstNode, context);
        }
        return {
            name: firstNode.value,
            required: true,
            default: null,
        };
    } else {
        if (end - begin === 2) {
            raiseArgError(firstNode, context);
        }
        const secondNode = rawArgs[begin + 1];
        if (secondNode.type !== 'symbol' || secondNode.value !== '=') {
            raiseArgError(firstNode, context);
        }
        return {
            name: firstNode.value,
            required: false,
            default: evalExpression(rawArgs, context, begin + 2, end),
        };
    }
};

/**
 * Parse argument list.
 */
export const parseArgList = (
    rawArgList: readonly SyntaxNode[],
    context: ScriptContext,
): ArgList => {
    const args = [];
    let allowRequired = true;
    let requiredCount = 0;
    let l = 0;
    let argDef;
    for (let r = 0; r < rawArgList.length; r++) {
        const node = rawArgList[r];
        if (node.type !== 'symbol' || node.value !== ',') {
            continue;
        }
        argDef = parseArg(rawArgList, l, r, context, allowRequired);
        args.push(argDef);
        if (argDef.required) {
            requiredCount++;
        } else {
            allowRequired = false;
        }
        l = r + 1;
    }
    if (l < rawArgList.length) { // ends without a comma
        argDef = parseArg(rawArgList, l, rawArgList.length, context, allowRequired);
        args.push(argDef);
        if (argDef.required) {
            requiredCount++;
        }
    }
    return { args, requiredCount };
};
