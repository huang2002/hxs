import { SymbolNode, parse, SpanNode } from '3h-ast';
import { builtins } from './builtins/index';
import { ContextValue, ScriptContext, SyntaxNode, Utils } from './common';
import { operatorHandlers, operatorPriorities } from './operators/index';

/**
 * Evalute a single node.
 */
export const evalNode = (
    node: SyntaxNode,
    context: ScriptContext,
): ContextValue => {
    switch (node.type) {
        case 'value': {
            return node.value;
        }
        case 'glob': {
            return node.value.slice(1, -1);
        }
        case 'number': {
            return Utils.parseNumber(node, context);
        }
        case 'span': {
            return evalExpression(node.body, context);
        }
        case 'word': {
            const name = node.value;
            const { store } = context;
            if (!store.has(name)) {
                Utils.raise(ReferenceError, `"${name}" is not defined`, node, context);
            }
            return store.get(name)!;
        }
        default: {
            Utils.raise(SyntaxError, 'unrecognized syntax', node, context);
            return null; // for type checking (ts v4.3.4)
        }
    }
};

/**
 * Execute and replace the given node of the buffer.
 */
export const evalBufferNode = (
    buffer: SyntaxNode[],
    index: number,
    referer: SyntaxNode,
    context: ScriptContext,
) => {
    if (index < 0 || index >= buffer.length) {
        Utils.raise(SyntaxError, 'invalid operation', referer, context);
    }
    return evalNode(buffer[index], context);
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
    let operatorNodes: (SymbolNode | SpanNode)[] = [];

    // find all operators (and spans)
    for (let i = 0; i < buffer.length; i++) {
        const node = buffer[i];
        if (node.type === 'symbol') {
            operatorNodes.push(node);
            if (!operatorPriorities.has(node.value)) {
                Utils.raise(SyntaxError, 'unknown operator', node, context);
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
 * Evaluate the given nodes.
 */
export const evalNodes = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length,
) => {
    let left = begin;
    for (let right = 0; right < end; right++) {
        const node = nodes[right];
        if (node.type === 'symbol' && node.value === ';') {
            evalExpression(nodes, context, left, right);
            left = right + 1;
        }
    }
    if (left < end) { // ends without a semicolon
        return evalExpression(nodes, context, left, end);
    } else { // ends with a semicolon
        return null;
    }
};

/**
 * Evalute an list.
 */
export const evalList = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length,
) => {
    const result = [];
    let left = begin;
    for (let right = 0; right < end; right++) {
        const node = nodes[right];
        if (node.type === 'symbol' && node.value === ',') {
            result.push(evalExpression(nodes, context, left, right));
            left = right + 1;
        }
    }
    if (left < end) { // ends without a semicolon
        result.push(evalExpression(nodes, context, left, end));
    }
    return result;
};

/**
 * Execute the given code.
 */
export const evalCode = (
    code: string,
    context?: Partial<ScriptContext>,
) => {
    const _context = {} as ScriptContext;
    if (context) {
        Object.assign(_context, context);
    }
    if (!_context.store) {
        _context.store = new Map(builtins);
    }
    if (!_context.source) {
        _context.source = 'unknown';
    }
    return evalNodes(parse(code).ast, _context);
};
