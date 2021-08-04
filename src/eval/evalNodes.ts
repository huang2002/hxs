import { ScriptContext, SyntaxNode, OperatorNode } from '../common';
import { getOperatorNodes, executeOperatorNodes } from './evalExpression';

export type CompiledNodes = Readonly<{
    buffers: readonly (SyntaxNode[])[];
    operatorNodes: readonly (readonly OperatorNode[])[];
    endsWithSemicolon: boolean;
}>;

export const compileNodes = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length,
): CompiledNodes => {
    const buffers = [];
    const operatorNodes = [];
    let left = begin;
    for (let right = 0; right < end; right++) {
        const node = nodes[right];
        if (node.type === 'symbol' && node.value === ';') {
            const buffer = nodes.slice(left, right);
            buffers.push(buffer);
            operatorNodes.push(
                getOperatorNodes(buffer, context)
            );
            left = right + 1;
        }
    }
    const endsWithSemicolon = left >= end;
    if (!endsWithSemicolon) { // ends without a semicolon
        const buffer = nodes.slice(left, end);
        buffers.push(buffer);
        operatorNodes.push(
            getOperatorNodes(buffer, context)
        );
    }
    return { buffers, operatorNodes, endsWithSemicolon };
};

export const evalCompiledNodes = (
    compiledNodes: CompiledNodes,
    context: ScriptContext,
    copyBuffers = false,
) => {
    const { buffers, operatorNodes, endsWithSemicolon } = compiledNodes;
    let lastValue = null;
    for (let i = 0; i < buffers.length; i++) {
        lastValue = executeOperatorNodes(
            copyBuffers ? buffers[i].slice() : buffers[i],
            operatorNodes[i],
            context,
        );
        context.store.set('_', lastValue);
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
        context
    )
);
