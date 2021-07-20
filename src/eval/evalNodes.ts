import { ScriptContext, SyntaxNode } from '../common';
import { CompiledExpression, compileExpression, evalCompiledExpression } from './evalExpression';

export type CompiledNodes = Readonly<{
    expressions: readonly CompiledExpression[];
    endsWithSemicolon: boolean;
}>;

export const compileNodes = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length,
) => {
    const expressions = [];
    let left = begin;
    for (let right = 0; right < end; right++) {
        const node = nodes[right];
        if (node.type === 'symbol' && node.value === ';') {
            expressions.push(
                compileExpression(
                    nodes.slice(left, right),
                    context
                )
            );
            left = right + 1;
        }
    }
    const endsWithSemicolon = left >= end;
    if (!endsWithSemicolon) { // ends without a semicolon
        expressions.push(
            compileExpression(
                nodes.slice(left, end),
                context
            )
        );
    }
    return { expressions, endsWithSemicolon };
};

export const evalCompiledNodes = (
    nodes: CompiledNodes,
) => {
    const { expressions, endsWithSemicolon } = nodes;
    let lastValue = null;
    for (let i = 0; i < expressions.length; i++) {
        lastValue = evalCompiledExpression(expressions[i]);
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
        compileNodes(nodes, context, begin, end)
    )
);
