import { ContextValue, ScriptContext, SyntaxNode } from '../common';
import { compileExpression, evalCompiledExpression, CompiledExpression } from './evalExpression';

export type CompiledNodes = Readonly<{
    compiledExpressions: readonly CompiledExpression[];
    endsWithSemicolon: boolean;
}>;

export const compileNodes = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length,
): CompiledNodes => {
    const compiledExpressions: CompiledExpression[] = [];
    if (begin >= end) {
        return {
            compiledExpressions,
            endsWithSemicolon: true,
        };
    }
    let left = begin;
    let right;
    for (right = 0; right <= end; right++) {
        if (right < end) {
            const node = nodes[right];
            if (node.type !== 'symbol' || node.value !== ';') {
                continue;
            }
        }
        const buffer = nodes.slice(left, right);
        compiledExpressions.push(
            compileExpression(buffer, context)
        );
        if (right < end - 1) {
            left = right + 1;
        } else {
            break;
        }
    }
    const endsWithSemicolon = right < end;
    return { compiledExpressions, endsWithSemicolon };
};

export const evalCompiledNodes = (
    compiledNodes: CompiledNodes,
    context: ScriptContext,
    copyBuffers: boolean,
    optimizeOperators: boolean,
): ContextValue => {
    const { compiledExpressions, endsWithSemicolon } = compiledNodes;
    let lastValue = null;
    for (let i = 0; i < compiledExpressions.length; i++) {
        lastValue = evalCompiledExpression(
            compiledExpressions[i],
            context,
            copyBuffers,
            optimizeOperators,
        );
        context.store._ = lastValue;
    }
    return endsWithSemicolon ? null : lastValue;
};

/**
 * Evaluate the given nodes.
 */
export const evalNodes = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length,
) => (
    evalCompiledNodes(
        compileNodes(nodes, context, begin, end),
        context,
        false,
        false,
    )
);
