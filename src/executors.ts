import { SymbolNode, parse, SpanNode } from '3h-ast';
import { builtins } from './builtins';
import { ScriptContext, SyntaxNode, Utils } from './common';
import { operatorHandlers, operatorPriorities } from './operators';

/**
 * Evalute a single node.
 */
export const evalNode = (
    node: SyntaxNode,
    context: ScriptContext,
    source: string,
): unknown => {
    switch (node.type) {
        case 'value':
        case 'glob': {
            return node.value;
        }
        case 'number': {
            return Utils.parseNumber(node, source);
        }
        case 'span': {
            return evalExpression(node.body, context, source);
        }
        case 'word': {
            const name = node.value;
            if (!context.has(name)) {
                Utils.raise(ReferenceError, `"${name}" is not defined`, node, source);
            }
            return context.get(name);
        }
        default: {
            Utils.raise(SyntaxError, 'unrecognized syntax', node, source);
        }
    }
};
/** dts2md break */
/**
 * Execute and replace the given node of the buffer.
 */
export const evalBufferNode = (
    buffer: SyntaxNode[],
    index: number,
    referer: SyntaxNode,
    context: ScriptContext,
    source: string,
) => {
    if (index < 0 || index >= buffer.length) {
        Utils.raise(SyntaxError, 'invalid operation', referer, source);
    }
    return evalNode(buffer[index], context, source);
};
/** dts2md break */
/**
 * Evalute an expression.
 */
export const evalExpression = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    source: string,
    begin = 0,
    end = nodes.length,
) => {

    if (begin >= end) {
        return null;
    }

    const buffer = nodes.slice(begin, end);
    let operatorNodes: (SymbolNode | SpanNode)[] = [];

    // find all operators (and spans)
    for (let i = 0; i < buffer.length; i++) {
        const node = buffer[i];
        if (node.type === 'symbol') {
            operatorNodes.push(node);
            if (!operatorPriorities.has(node.value)) {
                Utils.raise(SyntaxError, 'unknown operator', node, source);
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
            handler(buffer, index, context, source);
        }
    }

    // check result
    if (buffer.length > 1) {
        Utils.raise(SyntaxError, 'unrecognized syntax', buffer[1], source);
    } else if (buffer.length === 0) {
        return null;
    } else {
        return evalNode(buffer[0], context, source);
    }

};
/** dts2md break */
/**
 * Evaluate the given nodes.
 */
export const evalNodes = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    source: string,
    begin = 0,
    end = nodes.length,
) => {
    let left = begin;
    for (let right = 0; right < end; right++) {
        const node = nodes[right];
        if (node.type === 'symbol' && node.value === ';') {
            evalExpression(nodes, context, source, left, right);
            left = right + 1;
        }
    }
    if (left < end) { // ends without a semicolon
        return evalExpression(nodes, context, source, left, end);
    } else { // ends with a semicolon
        return null;
    }
};
/** dts2md break */
/**
 * Evalute an list.
 */
export const evalList = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    source: string,
    begin = 0,
    end = nodes.length,
) => {
    const result = [];
    let left = begin;
    for (let right = 0; right < end; right++) {
        const node = nodes[right];
        if (node.type === 'symbol' && node.value === ',') {
            result.push(evalExpression(nodes, context, source, left, right));
            left = right + 1;
        }
    }
    if (left < end) { // ends without a semicolon
        result.push(evalExpression(nodes, context, source, left, end));
    }
    return result;
};
/** dts2md break */
/**
 * Execute the given code.
 */
export const evalCode = (
    code: string,
    context = new Map(builtins),
    source = 'unknown',
) => (
    evalNodes(parse(code).ast, context, source)
);
