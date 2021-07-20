import { SymbolNode, SpanNode } from '3h-ast';
import { ContextValue, ScriptContext, SyntaxNode, Utils } from '../common';
import { operatorHandlers, operatorPriorities } from '../operators/index';
import { evalNode } from './evalNode';

export type OperatorNode = SymbolNode | SpanNode;

export const getOperatorNodes = (
    buffer: SyntaxNode[],
    context: ScriptContext,
) => {

    let operatorNodes: OperatorNode[] = [];

    // find all operators (and spans)
    for (let i = 0; i < buffer.length; i++) {
        const node = buffer[i];
        if (node.type === 'symbol') {
            operatorNodes.push(node);
            if (!operatorPriorities.has(node.value)) {
                Utils.raise(SyntaxError, `unknown operator "${node.value}"`, node, context);
            }
        } else if (node.type === 'span') {
            if (operatorPriorities.has(node.start)) {
                operatorNodes.push(node);
            }
        }
    }

    // sort operators in order of priority (high->low)
    Utils.sort(operatorNodes, (nodeA, nodeB) => {
        const priorityA = operatorPriorities.get(
            nodeA.type === 'symbol' ? nodeA.value : nodeA.start
        )!;
        const priorityB = operatorPriorities.get(
            nodeB.type === 'symbol' ? nodeB.value : nodeB.start
        )!;
        return priorityA - priorityB;
    });

    return operatorNodes;

};

export const executeOperatorNodes = (
    buffer: SyntaxNode[],
    operatorNodes: readonly OperatorNode[],
    context: ScriptContext,
): ContextValue => {

    // execute operators
    for (let i = 0; i < operatorNodes.length; i++) {
        const operatorNode = operatorNodes[i];
        const index = buffer.indexOf(operatorNode);
        if (~index) { // index !== -1
            const handler = operatorHandlers.get(
                operatorNode.type === 'symbol'
                    ? operatorNode.value
                    : operatorNode.start
            )!;
            handler(buffer, index, context);
        }
    }

    // check result
    if (buffer.length > 1) {
        Utils.raise(SyntaxError, 'unrecognized syntax', buffer[1], context);
        return null; // for type checking (ts v4.3.4)
    } else if (buffer.length === 0) {
        return null;
    } else {
        return evalNode(buffer[0], context);
    }

};

/**
 * Evalute an expression.
 */
export const evalExpression = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length
): ContextValue => {
    if (begin >= end) {
        return null;
    }
    const buffer = nodes.slice(begin, end);
    return executeOperatorNodes(
        buffer,
        getOperatorNodes(buffer, context),
        context
    );
};
