import { SymbolNode, WordNode } from '3h-ast';
import { ContextValue, SyntaxNode, ScriptContext, Utils, FunctionHandler } from '../common';
import { CompiledExpression, compileExpression } from '../eval/evalExpression';

export type FunctionCallback = (
    args: ContextValue[],
    referrer: SyntaxNode,
    context: ScriptContext,
    thisArg: ContextValue,
) => ContextValue;

export interface ArgDefinition {
    name: string;
    required: boolean;
    rest: boolean;
    default: CompiledExpression | null;
}

export interface ArgList {
    args: ArgDefinition[];
    requiredCount: number;
    restArg: string | null;
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
    const secondNode = rawArgs[begin + 1];
    if (!firstNode || firstNode.type !== 'word') {
        Utils.raise(SyntaxError, 'expect a word as argument name', firstNode, context);
    }
    if (end - begin === 1) {
        if (!allowRequired) {
            Utils.raise(SyntaxError, 'required argument must be before optional ones', firstNode, context);
        }
        return {
            name: firstNode.value,
            required: true,
            rest: false,
            default: null,
        };
    } else if (end - begin === 2) {
        if (
            secondNode.type !== 'symbol'
            || (secondNode.value !== '...' && secondNode.value !== '?')
        ) {
            Utils.raise(SyntaxError, 'invalid argument declaration', firstNode, context);
        }
        return {
            name: firstNode.value,
            required: false,
            rest: (secondNode as SymbolNode).value === '...',
            default: null,
        };
    } else {
        if (secondNode.type !== 'symbol' || secondNode.value !== '=') {
            Utils.raise(SyntaxError, 'invalid argument declaration', firstNode, context);
        }
        return {
            name: firstNode.value,
            required: false,
            rest: false,
            default: compileExpression(
                rawArgs.slice(begin + 2, end),
                context,
            ),
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
    if (rawArgList.length === 0) {
        return {
            args: [],
            requiredCount: 0,
            restArg: null,
        };
    }
    const args = [];
    let allowRequired = true;
    let requiredCount = 0;
    let l = 0;
    let argDef;
    let restArg = null;
    for (let r = 0; r <= rawArgList.length; r++) {
        if (r < rawArgList.length) {
            const node = rawArgList[r];
            if (node.type !== 'symbol' || node.value !== ',') {
                continue;
            }
        }
        if (restArg !== null) {
            Utils.raise(SyntaxError, 'rest argument must be the last one', rawArgList[l], context);
        }
        argDef = parseArg(rawArgList, l, r, context, allowRequired);
        if (argDef.rest) {
            restArg = argDef.name;
        } else {
            args.push(argDef);
            if (argDef.required) {
                requiredCount++;
            } else {
                allowRequired = false;
            }
        }
        if (r < rawArgList.length - 1) {
            l = r + 1;
        } else {
            break;
        }
    }
    return { args, requiredCount, restArg };
};

export const isInvocable = (target: ContextValue) => (
    (typeof target === 'function')
    || (Utils.isDict(target) && ('__invoke' in target))
);

export const invoke = (
    target: ContextValue,
    rawArgs: readonly SyntaxNode[],
    referrer: SyntaxNode,
    context: ScriptContext,
    thisArg: ContextValue,
): ContextValue => {
    context.stack.push(
        Utils.formatFrameString(referrer, context)
    );
    if (typeof target === 'function') {
        const returnValue = target(rawArgs, referrer, context, thisArg);
        context.stack.pop();
        return returnValue;
    } else if (Utils.isDict(target) && ('__invoke' in target)) {
        if (typeof target.__invoke !== 'function') {
            Utils.raise(TypeError, 'expect `__invoke` to be a function', referrer, context);
        }
        const returnValue = (target.__invoke as FunctionHandler)(rawArgs, referrer, context, thisArg);
        context.stack.pop();
        return returnValue;
    } else {
        Utils.raise(TypeError, 'expect a function or a dict with proper `__invoke`', referrer, context);
        return null; // for type checking
    }
};
