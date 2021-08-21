import { ScriptContext, SyntaxNode, OperatorNode } from '../common';
import { getOperatorNodes, executeOperatorNodes } from './evalExpression';

export type CompiledNodes = Readonly<{
    buffers: readonly (SyntaxNode[])[];
    operatorNodes: readonly (OperatorNode[])[];
    endsWithSemicolon: boolean;
}>;

export const compileNodes = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length,
): CompiledNodes => {
    const buffers: SyntaxNode[][] = [];
    const operatorNodes: OperatorNode[][] = [];
    if (begin >= end) {
        return {
            buffers,
            operatorNodes,
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
        buffers.push(buffer);
        operatorNodes.push(
            getOperatorNodes(buffer, context)
        );
        if (right < end - 1) {
            left = right + 1;
        } else {
            break;
        }
    }
    const endsWithSemicolon = right < end;
    return { buffers, operatorNodes, endsWithSemicolon };
};

export const evalCompiledNodes = (
    compiledNodes: CompiledNodes,
    context: ScriptContext,
    copyBuffers = false,
    optimizeOperators = true,
) => {
    const { buffers, operatorNodes, endsWithSemicolon } = compiledNodes;
    let lastValue = null;
    for (let i = 0; i < buffers.length; i++) {
        lastValue = executeOperatorNodes(
            copyBuffers ? buffers[i].slice() : buffers[i],
            operatorNodes[i],
            context,
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
