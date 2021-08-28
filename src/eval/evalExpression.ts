import { ContextValue, ScriptContext, SyntaxNode, Utils, OperatorNode } from '../common';
import { operatorHandlers, operatorLtr, operatorPriorities } from '../operators/index';
import { evalNode } from './evalNode';

export type CompiledExpression = Readonly<{
    buffer: SyntaxNode[];
    operatorNodes: OperatorNode[];
}>;

export const compileExpression = (
    buffer: SyntaxNode[],
    context: ScriptContext,
): CompiledExpression => {

    let operatorNodes: OperatorNode[] = [];

    // find all operators (and spans)
    for (let i = 0; i < buffer.length; i++) {
        const node = buffer[i];
        if (node.type === 'symbol') {
            operatorNodes.push(node);
            if (!operatorPriorities.has(node.value)) {
                Utils.raise(SyntaxError, `unknown operator ${Utils.toDisplay(node.value)}`, node, context);
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
            Utils.getOperatorSymbol(nodeA)
        )!;
        const priorityB = operatorPriorities.get(
            Utils.getOperatorSymbol(nodeB)
        )!;
        return priorityA - priorityB;
    });

    let p = 0;
    let t;
    while (p < operatorNodes.length) {
        let symbol = Utils.getOperatorSymbol(operatorNodes[p]);
        for (let q = p + 1; q <= operatorNodes.length; q++) {
            if (
                q < operatorNodes.length
                && Utils.getOperatorSymbol(operatorNodes[q]) === symbol
            ) {
                continue;
            }
            if (operatorLtr.get(symbol)!) {
                p = q;
                break;
            }
            let l = p;
            let r = q - 1;
            while (l < r) {
                t = operatorNodes[l];
                operatorNodes[l] = operatorNodes[r];
                operatorNodes[r] = t;
                l++;
                r--;
            }
            p = q;
        }
    }

    return { buffer, operatorNodes };

};

export const evalCompiledExpression = (
    compiledExpression: CompiledExpression,
    context: ScriptContext,
    copyBuffers: boolean,
    optimizeOperators: boolean,
): ContextValue => {

    const { operatorNodes, buffer: _buffer } = compiledExpression;
    const buffer = copyBuffers ? _buffer.slice() : _buffer;

    let extraOperatorIndices: Set<number> | null = null;
    if (optimizeOperators) {
        extraOperatorIndices = new Set();
    }

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
        } else if (optimizeOperators) {
            extraOperatorIndices!.add(i);
        }
    }

    // remove extra operators
    if (extraOperatorIndices) {
        const optimizedOperators = operatorNodes.filter(
            (_, i) => !extraOperatorIndices!.has(i)
        );
        if (optimizedOperators.length < operatorNodes.length) {
            for (let i = 0; i < optimizedOperators.length; i++) {
                operatorNodes[i] = optimizedOperators[i];
            }
            operatorNodes.length = optimizedOperators.length;
        }
    }

    // check result
    if (buffer.length > 1) {
        Utils.raise(SyntaxError, 'unrecognized syntax', buffer[1], context);
        return null; // for type checking
    } else if (buffer.length === 0) {
        return null; // for type checking
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
    end = nodes.length,
): ContextValue => {
    if (begin >= end) {
        return null;
    }
    const buffer = nodes.slice(begin, end);
    return evalCompiledExpression(
        compileExpression(buffer, context),
        context,
        false,
        false,
    );
};
